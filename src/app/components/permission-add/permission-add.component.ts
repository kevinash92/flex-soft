import { Component, ViewEncapsulation, EventEmitter, Input, Output, Inject } from '@angular/core';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NodePermissionService } from '@alfresco/adf-content-services';


@Component({
  selector: 'aca-permission-add',
  templateUrl: './permission-add.component.html',
  styleUrls: ['./permission-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionAddComponent {

    /** ID of the target node. */
    @Input()
    nodeId: string;

    /** Emitted when the node is updated successfully. */
    @Output()
    success: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter();

    /** Emitted when an error occurs during the update. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    selectedItems: MinimalNodeEntity[] = [];
    currentNode: MinimalNodeEntryEntity;
    currentNodeRoles: string[];

    constructor(@Inject(MAT_DIALOG_DATA) data: any, private nodePermissionService: NodePermissionService) {
      this.nodeId = data.node.entry.id;
      console.log(data.node.entry);
    }

    onSelect(selection: MinimalNodeEntity[]) {
        this.selectedItems = selection;
    }

    applySelection() {
        this.nodePermissionService.updateNodePermissions(this.nodeId, this.selectedItems)
            .subscribe(
                (node) => {
                    this.success.emit(node);
                    alert("Enfin OK! succès")
                },
                (error) => {
                    this.error.emit(error);
                    console.log(error)
                    alert("Enfin OK! erreur")
                });

    }

}
