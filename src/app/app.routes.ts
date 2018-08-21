
import { Routes } from '@angular/router';
import { AuthGuardEcm } from '@alfresco/adf-core';

import { LayoutComponent } from './components/layout/layout.component';

import { FilesComponent } from './components/files/files.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { AboutComponent } from './components/about/about.component';

import { LoginComponent } from './components/login/login.component';
import { PreviewComponent } from './components/preview/preview.component';
import { GenericErrorComponent } from './components/generic-error/generic-error.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';

import { ProfileResolver } from './common/services/profile.resolver';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'APP.SIGN_IN'
        }
    },
    {
        path: 'settings',
        component: SettingsComponent,
        data: {
            title: 'Settings'
        }
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: { profile: ProfileResolver },
        children: [
            {
                path: '',
                redirectTo: `/personal-files`,
                pathMatch: 'full'
            },
            {
                path: 'favorites',
                data: {
                    sortingPreferenceKey: 'favorites'
                },
                children: [
                    {
                        path: '',
                        component: FavoritesComponent,
                        data: {
                            title: 'APP.BROWSE.FAVORITES.TITLE'
                        }
                    },
                    {
                        path: 'preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'favorites'
                        }
                    }
                ]
            },
            {
                path: 'libraries',
                data: {
                    sortingPreferenceKey: 'libraries'
                },
                children: [{
                    path: '',
                    component: LibrariesComponent,
                    data: {
                        title: 'APP.BROWSE.LIBRARIES.TITLE'
                    }
                }, {
                    path: ':folderId',
                    component: FilesComponent,
                    data: {
                        title: 'APP.BROWSE.LIBRARIES.TITLE',
                        sortingPreferenceKey: 'libraries-files'
                    }
                },
                {
                    path: ':folderId/preview/:nodeId',
                    component: PreviewComponent,
                    data: {
                        title: 'APP.PREVIEW.TITLE',
                        navigateMultiple: true,
                        navigateSource: 'libraries'
                    }
                }
                ]
            },
            {
                path: 'personal-files',
                data: {
                    sortingPreferenceKey: 'personal-files'
                },
                children: [
                    {
                        path: '',
                        component: FilesComponent,
                        data: {
                            title: 'APP.BROWSE.PERSONAL.TITLE',
                            defaultNodeId: '-my-'
                        }
                    },
                    {
                        path: ':folderId',
                        component: FilesComponent,
                        data: {
                            title: 'APP.BROWSE.PERSONAL.TITLE'
                        }
                    },
                    {
                        path: 'preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'personal-files'
                        }
                    },
                    {
                        path: ':folderId/preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'personal-files'
                        }
                    }
                ]
            },
            {
                path: 'recent-files',
                data: {
                    sortingPreferenceKey: 'recent-files'
                },
                children: [
                    {
                        path: '',
                        component: RecentFilesComponent,
                        data: {
                            title: 'APP.BROWSE.RECENT.TITLE'
                        }
                    },
                    {
                        path: 'preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'recent-files'
                        }
                    }
                ]
            },
            {
                path: 'shared',
                data: {
                    sortingPreferenceKey: 'shared-files'
                },
                children: [
                    {
                        path: '',
                        component: SharedFilesComponent,
                        data: {
                            title: 'APP.BROWSE.SHARED.TITLE'
                        }
                    },
                    {
                        path: 'preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'shared'
                        }
                    }
                ]
            },
            {
                path: 'trashcan',
                component: TrashcanComponent,
                data: {
                    title: 'APP.BROWSE.TRASHCAN.TITLE',
                    sortingPreferenceKey: 'trashcan'
                }
            },
            {
                path: 'about',
                component: AboutComponent,
                data: {
                    title: 'APP.BROWSE.ABOUT.TITLE'
                }
            },
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        component: SearchComponent,
                        data: {
                            title: 'APP.BROWSE.SEARCH.TITLE'
                        }
                    },
                    {
                        path: 'preview/:nodeId',
                        component: PreviewComponent,
                        data: {
                            title: 'APP.PREVIEW.TITLE',
                            navigateMultiple: true,
                            navigateSource: 'search'
                        }
                    }
                ]
            },
            {
                path: '**',
                component: GenericErrorComponent
            }
        ],
        canActivateChild: [ AuthGuardEcm ],
        canActivate: [ AuthGuardEcm ]
    }
];
