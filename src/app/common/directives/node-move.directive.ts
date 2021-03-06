/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Directive, HostListener, Input } from '@angular/core';

import { TranslationService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { MatSnackBar } from '@angular/material';

import { ContentManagementService } from '../services/content-management.service';
import { NodeActionsService } from '../services/node-actions.service';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { SnackbarErrorAction } from '../../store/actions';
import { ContentApiService } from '../../services/content-api.service';

@Directive({
    selector: '[acaMoveNode]'
})

export class NodeMoveDirective {
    // tslint:disable-next-line:no-input-rename
    @Input('acaMoveNode')
    selection: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.moveSelected();
    }

    constructor(
        private store: Store<AppStore>,
        private contentApi: ContentApiService,
        private content: ContentManagementService,
        private nodeActionsService: NodeActionsService,
        private translation: TranslationService,
        private snackBar: MatSnackBar
    ) {}

    moveSelected() {
        const permissionForMove = '!';

        Observable.zip(
            this.nodeActionsService.moveNodes(this.selection, permissionForMove),
            this.nodeActionsService.contentMoved
        ).subscribe(
            (result) => {
                const [ operationResult, moveResponse ] = result;
                this.toastMessage(operationResult, moveResponse);

                this.content.nodesMoved.next(null);
            },
            (error) => {
                this.toastMessage(error);
            }
        );
    }

    private toastMessage(info: any, moveResponse?: any) {
        const succeeded = (moveResponse && moveResponse['succeeded']) ? moveResponse['succeeded'].length : 0;
        const partiallySucceeded = (moveResponse && moveResponse['partiallySucceeded']) ? moveResponse['partiallySucceeded'].length : 0;
        const failures = (moveResponse && moveResponse['failed']) ? moveResponse['failed'].length : 0;

        let successMessage = '';
        let partialSuccessMessage = '';
        let failedMessage = '';
        let errorMessage = '';

        if (typeof info === 'string') {

            // in case of success
            if (info.toLowerCase().indexOf('succes') !== -1) {
                const i18nMessageString = 'APP.MESSAGES.INFO.NODE_MOVE.';
                let i18MessageSuffix = '';

                if (succeeded) {
                    i18MessageSuffix = ( succeeded === 1 ) ? 'SINGULAR' : 'PLURAL';
                    successMessage = `${i18nMessageString}${i18MessageSuffix}`;
                }

                if (partiallySucceeded) {
                    i18MessageSuffix = ( partiallySucceeded === 1 ) ? 'PARTIAL.SINGULAR' : 'PARTIAL.PLURAL';
                    partialSuccessMessage = `${i18nMessageString}${i18MessageSuffix}`;
                }

                if (failures) {
                    // if moving failed for ALL nodes, emit error
                    if (failures === this.selection.length) {
                        const errors = this.nodeActionsService.flatten(moveResponse['failed']);
                        errorMessage = this.getErrorMessage(errors[0]);

                    } else {
                        i18MessageSuffix = 'PARTIAL.FAIL';
                        failedMessage = `${i18nMessageString}${i18MessageSuffix}`;
                    }
                }
            } else {
                errorMessage = 'APP.MESSAGES.ERRORS.GENERIC';
            }

        } else {
            errorMessage = this.getErrorMessage(info);
        }

        const undo = (succeeded + partiallySucceeded > 0) ? this.translation.instant('APP.ACTIONS.UNDO') : '';
        failedMessage = errorMessage ?  errorMessage : failedMessage;

        const beforePartialSuccessMessage = (successMessage && partialSuccessMessage) ? ' ' : '';
        const beforeFailedMessage = ((successMessage || partialSuccessMessage) && failedMessage) ? ' ' : '';

        const initialParentId = this.nodeActionsService.getEntryParentId(this.selection[0].entry);

        const messages = this.translation.instant(
            [successMessage, partialSuccessMessage, failedMessage],
            { success: succeeded, failed: failures, partially: partiallySucceeded}
        );

        // TODO: review in terms of i18n
        this.snackBar
            .open(
                messages[successMessage]
                + beforePartialSuccessMessage + messages[partialSuccessMessage]
                + beforeFailedMessage + messages[failedMessage]
                    , undo, {
                        panelClass: 'info-snackbar',
                        duration: 3000
                    })
                    .onAction()
                    .subscribe(() => this.revertMoving(moveResponse, initialParentId));
    }

    getErrorMessage(errorObject): string {
        let i18nMessageString = 'APP.MESSAGES.ERRORS.GENERIC';

        try {
            const { error: { statusCode } } = JSON.parse(errorObject.message);

            if (statusCode === 409) {
                i18nMessageString =  'APP.MESSAGES.ERRORS.NODE_MOVE';

            } else if (statusCode === 403) {
                i18nMessageString = 'APP.MESSAGES.ERRORS.PERMISSION';
            }

        } catch (err) { /* Do nothing, keep the original message */ }

        return i18nMessageString;
    }

    private revertMoving(moveResponse, selectionParentId) {
        const movedNodes = (moveResponse && moveResponse['succeeded']) ? moveResponse['succeeded'] : [];
        const partiallyMovedNodes = (moveResponse && moveResponse['partiallySucceeded']) ? moveResponse['partiallySucceeded'] : [];

        const restoreDeletedNodesBatch = this.nodeActionsService.moveDeletedEntries
            .map((folderEntry) => {
                return this.contentApi
                    .restoreNode(folderEntry.nodeId || folderEntry.id)
                    .map(node => node.entry);
            });

        Observable.zip(...restoreDeletedNodesBatch, Observable.of(null))
            .flatMap(() => {

                const nodesToBeMovedBack = [...partiallyMovedNodes, ...movedNodes];

                const revertMoveBatch = this.nodeActionsService
                    .flatten(nodesToBeMovedBack)
                    .filter(node => node.entry || (node.itemMoved && node.itemMoved.entry))
                    .map((node) => {
                        if (node.itemMoved) {
                            return this.nodeActionsService.moveNodeAction(node.itemMoved.entry, node.initialParentId);
                        } else {
                            return this.nodeActionsService.moveNodeAction(node.entry, selectionParentId);
                        }
                    });

                return Observable.zip(...revertMoveBatch, Observable.of(null));
            })
            .subscribe(
                () => {
                    this.content.nodesMoved.next(null);
                },
                error => {
                    let message = 'APP.MESSAGES.ERRORS.GENERIC';

                    let errorJson = null;
                    try {
                        errorJson = JSON.parse(error.message);
                    } catch {}

                    if (errorJson && errorJson.error && errorJson.error.statusCode === 403) {
                        message = 'APP.MESSAGES.ERRORS.PERMISSION';
                    }

                    this.store.dispatch(new SnackbarErrorAction(message));
                }
            );
    }

}
