import { Subscription, Observable } from 'rxjs/Rx';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AppConfigService } from '@alfresco/adf-core';


import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { AppStore, ProfileState } from '../../store/states';
import { Store } from '@ngrx/store';
import { selectUser, appLanguagePicker } from '../../store/selectors/app.selectors';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    @Input() showLabel: boolean;

    node: MinimalNodeEntryEntity = null;
    navigation = [];
    dashboard = Array<any>();

    private subscriptions: Subscription[] = [];

    profile$: Observable<ProfileState>;
    languagePicker$: Observable<boolean>;
    constructor(
        private browsingFilesService: BrowsingFilesService,
        private appConfig: AppConfigService,
        public permission: NodePermissionService,
        store: Store<AppStore>
    ) {
      this.profile$ = store.select(selectUser);
      this.languagePicker$ = store.select(appLanguagePicker);
    }

    ngOnInit() {
        this.navigation = this.buildMenu();

        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent
                .subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);

        this.dashboard = this.buildDashboard();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map((key) => data[key]);
    }

    // méthode ajoutée
    private buildDashboard() {
      let dashboard = [
        {
          heading : "Documents reçus",
          isOpen:"true",
          isSelected: "false",
          headingIcon: "call_received",
          headingIconTooltip: "Votre flux de traitement",
          menu: [
            {
              label:"A valider",
              title:"Vos documents à valider"+".",
              route: '/unvalidateddoc',
              icon: "refresh"
           },
            {
              label:"Refusés",
              title:"Documents que vous avez refusés"+".",
              route: '/rejecteddoc',
              icon: "close"
           },
            {
              label:"Validés",
              title:"Documents traités"+".",
              route: '/validateddoc',
              icon: "done_all"
           },
            {
              label:"Copie/Information",
              title:"Documents transmis en tant que copie",
              route: '/informationdoc',
              icon: "info"
           }
          ]
        },

        {
          heading : "Documents émis",
          isOpen:"false",
          isSelected: "false",
          headingIcon: "call_made",
          headingIconTooltip: "Votre flux de traitement émis",
          menu: [
            {
              label:"A traiter",
              title:"Vos documents à valider",
              route: '/atraiter',
              icon: "input"
           },
            {
              label:"Envoyés",
              title:"Vos documents à valider"+".",
              route: '/envoyes',
              icon: "send"
           },
            {
              label:"Brouillon",
              title:"Vos documents à valider"+".",
              route: '/brouillon',
              icon: "drafts"
           },
            {
              label:"Cloturé",
              title:"Vos documents à valider"+".",
              route: '/clotures',
              icon: "close"
           },
          ]
        }

      ]
      return dashboard;
    }
}
