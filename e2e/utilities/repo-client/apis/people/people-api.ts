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

import { PersonModel, Person } from './people-api-models';
import { RepoApiNew } from '../../repo-api-new';

export class PeopleApi extends RepoApiNew {

    constructor(username?, password?) {
        super(username, password);
    }

    async createUser(user: PersonModel) {
        const person = new Person(user);
        await this.apiAuth();
        return await this.alfrescoJsApi.core.peopleApi.addPerson(person);
    }

    async getUser(username: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.peopleApi.getPerson(username);
    }

    // async updateUser(username: string, userDetails?: PersonModel) {
        // await this.apiAuth();
    // }
    // updateUser(username: string, details?: Person): Promise<any> {
    //     if (details.id) {
    //         delete details.id;
    //     }
    //     return this
    //         .put(`/people/${username}`, { data: details })
    //         .catch(this.handleError);
    // }
    //     return this
    //         .post(`/people`, { data: person })
    //         .then(onSuccess, onError)
    //         .catch(this.handleError);
    // }

    // async disableUser(username: string) {
    // }
    // disableUser(username: string): Promise<any> {
    //     return this.put(`/people/${username}`, { data: { enabled: false } })
    //         .catch(this.handleError);
    // }

    // async changePassword(username: string, newPassword: string) {
    // }
    // changePassword(username: string, newPassword: string) {
    //     return this.put(`/people/${username}`, { data: { password: newPassword } })
    //         .catch(this.handleError);
    // }
}
