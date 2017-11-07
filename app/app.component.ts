import { Component, OnInit, ViewChild } from '@angular/core';
import { IEditCell, Column } from '@syncfusion/ej2-ng-grids';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DataManager, Query } from '@syncfusion/ej2-data';

@Component({
    selector: 'my-app',
    template: ` <button (click)='onClick()'>Destroy Grid</button>
    <form><ej-grid #grid id='editgrid' [dataSource]='data'[editSettings]='editSetting'
                (actionBegin)='actionBeginHandler($event)' (actionComplete)='actionCompleteHandler($event)'>
                <e-columns>
                    <e-column field='No' [isPrimaryKey]='true' [visible]='false'></e-column>
                    <e-column field='Cityid' headerText='City ID' width=120 [valueAccessor]='formatter' [edit]='customEditCell'></e-column>
                    <e-column field='Country' headerText='Country' width=120 ></e-column>
                </e-columns>
                </ej-grid> </form>`
})
export class AppComponent implements OnInit {

    @ViewChild('grid')
    public grid;
    public editSetting: Object;
    public customEditCell: IEditCell;
    public dropdownObj: DropDownList;
    public focusIndex: number;

    // Grid data Source 
    public data: Object[] = [{ No: 1, Cityid: 1, Country: 'India' }, { No: 2, Cityid: 2, Country: 'India' },
    { No: 3, Cityid: 3, Country: 'India' }, { No: 4, Cityid: 4, Country: 'India' }, { No: 5, Cityid: 5, Country: 'India' }];

    // dropdown datasource
    public dropDownDs = [{ ShipCity: 'mumbai', CityID: 1 }, { ShipCity: 'chennai', CityID: 2 },
    { ShipCity: 'Pune', CityID: 3 }, { ShipCity: 'Delhi', CityID: 4 }, { ShipCity: 'Kolkatta', CityID: 5 }];

    ngOnInit(): void {
        this.editSetting = { allowEditing: true, allowDeleting: true, allowAdding: true };
        this.customEditCell = { read: this.read.bind(this), write: this.write.bind(this), destroy: this.destroy.bind(this) };
    }

    // format/change the grid cell value using the formatter function.
    public formatter = (field, data) => {
        return this.getvalue(data);
    }

    // Find the disply value from the id of city
    private getvalue(data: any) {
        let dm: DataManager = new DataManager(this.dropDownDs as any);
        let query: Query = new Query();
        query.where('CityID', 'equal', data.Cityid);
        let result: Object[] = dm.executeLocal(query);
        return result[0]['ShipCity'];
    }


    // destroy the syncfusion component using `destroy` method.
    // all Syncfusion component have destroy method.
    // here grid component has destroy on the button click event.
    onClick() {
        this.grid.destroy();
    }

    // create custom edit cell element
    create(){
        let div = document.createElement('input');
        return div;
    }
    // read the edited value to save dataSource.
    read(args) {
        // the returned value is updated in dataSource with column.field property.
        return this.dropdownObj.value;
    }
    // create Custom Edit cell.
    write(args: { rowData: Object, element: Element, column: Column, requestType: string }) {
        this.dropdownObj = new DropDownList(
            {
                dataSource: new DataManager(<any>this.dropDownDs),
                text: this.getvalue(args.rowData), popupHeight: '200px',
                fields: {text: 'ShipCity', value: 'CityID'}
            });
        this.dropdownObj.appendTo(args.element as HTMLElement);
    }
    // destroy the drop down component.
    destroy() {
        this.dropdownObj.destroy();
    }



    // below functions used for focus the clicked cell.
    // find the index of cliked td.
    actionBeginHandler(args: any) {
        if (args.requestType as string === 'beginEdit') {
            this.focusIndex = (<any>document.activeElement).cellIndex;
        }
    }

    // focusing the clicked cell
    actionCompleteHandler(args: any) {
        if (args.requestType as string === 'beginEdit') {
            // you can use focus or select
            // * focus - focusing the clicked cell.
            // * select - focusing the clicked cell and select the content.
            // here
            // args.row -- Current edited row element
            // "this.grid.element.id + this.grid.columns[this.focusIndex].field" -- is id of the clicked cell
            args.row.querySelector('#' + this.grid.element.id + this.grid.columns[this.focusIndex].field).select();
        }
    }
}
