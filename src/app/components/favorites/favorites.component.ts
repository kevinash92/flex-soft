import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    PathElementEntity,
    PathInfo
} from 'alfresco-js-api';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { AppStore } from '../../store/states/app.state';
import { PageComponent } from '../page.component';
import { ContentApiService } from '../../services/content-api.service';

@Component({
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit {
    constructor(
        private router: Router,
        store: Store<AppStore>,
        private contentApi: ContentApiService,
        private content: ContentManagementService,
        public permission: NodePermissionService
    ) {
        super(store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions = this.subscriptions.concat([
            this.content.nodesDeleted.subscribe(() => this.reload()),
            this.content.nodesRestored.subscribe(() => this.reload()),
            this.content.folderEdited.subscribe(() => this.reload()),
            this.content.nodesMoved.subscribe(() => this.reload())
        ]);
    }

    navigate(favorite: MinimalNodeEntryEntity) {
        const { isFolder, id } = favorite;

        // TODO: rework as it will fail on non-English setups
        const isSitePath = (path: PathInfo): boolean => {
            return path.elements.some(
                ({ name }: PathElementEntity) => name === 'Sites'
            );
        };

        if (isFolder) {
            this.contentApi
                .getNode(id)
                .map(node => node.entry)
                .subscribe(({ path }: MinimalNodeEntryEntity) => {
                    const routeUrl = isSitePath(path)
                        ? '/libraries'
                        : '/personal-files';
                    this.router.navigate([routeUrl, id]);
                });
        }
    }

    onNodeDoubleClick(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFolder) {
                this.navigate(node.entry);
            }

            if (node.entry.isFile) {
                this.showPreview(node);
            }
        }
    }
}
