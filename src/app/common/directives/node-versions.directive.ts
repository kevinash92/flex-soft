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
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodeVersionsDialogComponent } from '../../dialogs/node-versions/node-versions.dialog';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { SnackbarErrorAction } from '../../store/actions';
import { ContentApiService } from '../../services/content-api.service';

@Directive({
    selector: '[acaNodeVersions]'
})
export class NodeVersionsDirective {
    // tslint:disable-next-line:no-input-rename
    @Input('acaNodeVersions') node: MinimalNodeEntity;

    @HostListener('click')
    onClick() {
        this.onManageVersions();
    }

    constructor(
        private store: Store<AppStore>,
        private contentApi: ContentApiService,
        private dialog: MatDialog
    ) {}

    async onManageVersions() {
        if (this.node && this.node.entry) {
            let entry = this.node.entry;

            if (entry.nodeId || (<any>entry).guid) {
                entry = await this.contentApi.getNodeInfo(
                    entry.nodeId || (<any>entry).id
                ).toPromise();
                this.openVersionManagerDialog(entry);
            } else {
                this.openVersionManagerDialog(entry);
            }
        } else if (this.node) {
            this.openVersionManagerDialog(<MinimalNodeEntryEntity>this.node);
        }
    }

    openVersionManagerDialog(node: MinimalNodeEntryEntity) {
        // workaround Shared
        if (node.isFile || node.nodeId) {
            this.dialog.open(NodeVersionsDialogComponent, {
                data: { node },
                panelClass: 'adf-version-manager-dialog-panel',
                width: '630px'
            });
        } else {
            this.store.dispatch(
                new SnackbarErrorAction('APP.MESSAGES.ERRORS.PERMISSION')
            );
        }
    }
}
