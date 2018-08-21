import { Component, OnInit } from '@angular/core';
import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/selectors/app.selectors';
import { AppStore } from '../../store/states/app.state';
import { ProfileState } from '../../store/states/profile.state';

@Component({
    templateUrl: './trashcan.component.html'
})
export class TrashcanComponent extends PageComponent implements OnInit {
    user: ProfileState;

    constructor(private contentManagementService: ContentManagementService,
                store: Store<AppStore>) {
        super(store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(
            this.contentManagementService.nodesRestored.subscribe(() => this.reload()),
            this.contentManagementService.nodesPurged.subscribe(() => this.reload()),
            this.contentManagementService.nodesRestored.subscribe(() => this.reload()),
            this.store.select(selectUser).subscribe((user) => this.user = user)
        );
    }
 }
