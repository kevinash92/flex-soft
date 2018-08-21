import { ElementRef, ViewChild, Component, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import { MatExpansionPanel } from "@angular/material";

@Component({
  selector: 'aca-sideboard',
  templateUrl: './sideboard.component.html',
  styleUrls: ['./sideboard.component.scss']
})
export class SideboardComponent implements AfterViewInit {
    private _isOpen: boolean = false;
    private _isSelected: boolean = false;

    teste = "bol";

    @ViewChild('contentWrapper')
    contentWrapper: ElementRef;

    @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;

    /** Title heading for the group. */
    @Input()
    heading: string;

    /** The material design icon. */
    @Input()
    headingIcon: string;

    /** Tooltip message to be shown for headingIcon */
    @Input()
    headingIconTooltip: string;

   /** Should the (expanded) accordion icon be shown? */
    @Input()
    hasAccordionIcon: boolean = true;

    /** Emitted when the heading is clicked. */
    @Output()
    headingClick: EventEmitter<any> = new EventEmitter<any>();

    /** Is this group currently open? */
    @Input()
    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    get isOpen() {
        return this._isOpen;
    }

    /** Is this group currently selected? */
    @Input()
    set isSelected(value: boolean) {
        this._isSelected = value;
    }

    get isSelected() {
        return this._isSelected;
    }

    hasContent: boolean;

    constructor() { }

    ngAfterViewInit() {
        this.hasContent = this.contentWrapper.nativeElement && this.contentWrapper.nativeElement.children.length > 0;
    }

    hasHeadingIcon() {
        return this.headingIcon ? true : false;
    }

    onHeaderClick(): void {
        this.headingClick.emit(this.heading);
    }

    isExpandable(event: any) {
        if (!this.hasContent || !this.isOpen) {
            this.expandPanel();
        }
    }

    expandPanel() {
        this.expansionPanel.expanded = !this.expansionPanel.expanded;
    }

    toggleExpansion(): boolean {
        return this.isOpen && this.isSelected;
    }
}
