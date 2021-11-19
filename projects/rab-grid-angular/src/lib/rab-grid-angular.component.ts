import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RABGridConf } from './rab-grid.enum';
import { RABGridButtonClickOut, RABGridCellClickOut, RABGridConfig, RABGridConfigDataColumnInputOption, RABGridData, 
  RABGridExportMenuItem, RABGridSaveRowClickOut, RABGridSortClickOut } from './rab-grid.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RABGrid } from './rab-grid';

@Component({
  selector: 'rab-grid',
  templateUrl: './rab-grid-angular.component.html',
  styleUrls: [
    './rab-grid-angular.component.css'
  ]
})
export class RabGridAngularComponent implements OnInit {

  private _data: RABGridData[] | any[] = []

  @Input() config: RABGridConfig | undefined
  @Input()
  set data(value: RABGridData[] | any[]) {
    if(!value || this._data.length > value?.length && !this.getConfig(RABGridConf.DataLength)) {
      this.page = 1
    }

    this._data = value?.length ? value : []

    if(this.getConfig(RABGridConf.PaginationEnable)) {
      this.pageNumbers = []

      let pagesC = this.getConfig(RABGridConf.DataLength) ?
        this.getConfig(RABGridConf.DataLength) / this.getConfig(RABGridConf.PageSize) :
        value.length / this.getConfig(RABGridConf.PageSize)

      if((this.getConfig(RABGridConf.DataLength) ?
        this.getConfig(RABGridConf.DataLength) % this.getConfig(RABGridConf.PageSize) :
        value.length % this.getConfig(RABGridConf.PageSize)) > 0) {

          pagesC += 1;
      }

      for (let i = 1; i <= pagesC; i++) {
        this.pageNumbers.push(i)
      }
    }

    if(!this.pageNumbers.includes(this.page)) {
      this.page = 1
    }

    this.changePage(this.page)
    this.sort(null, false)
  }
  get data(): RABGridData[] {
    return this._data as RABGridData[]
  }
  @Input() loading = false

  @Output() addNewClick = new EventEmitter<null>()
  @Output() buttonClick = new EventEmitter<RABGridButtonClickOut>()
  @Output() cancelNewClick = new EventEmitter<null>()
  @Output() cellClick = new EventEmitter<RABGridCellClickOut>()
  @Output() deleteAllClick = new EventEmitter<null>()
  @Output() deleteClick = new EventEmitter<RABGridData>()
  @Output() editRowClick = new EventEmitter<RABGridData>()
  @Output() pageChanged = new EventEmitter<number>()
  @Output() pageSizeChanged = new EventEmitter<number>()
  @Output() saveAllClick = new EventEmitter<RABGridData[]>()
  @Output() saveClick = new EventEmitter<RABGridSaveRowClickOut>()
  @Output() saveNewClick = new EventEmitter<RABGridData>()
  @Output() sortClick = new EventEmitter<RABGridSortClickOut>()

  RABGridConf = RABGridConf

  sortBy = ''
  sortDirection = 0
  sortData: RABGridData[] = []
  downloadMode = false
  pageData: RABGridData[] = []
  page = 1
  pageNumbers: number[] = []
  customPageSize = 10
  editingRow: RABGridData = {}
  nonEditedRow: RABGridData = {}
  editingAll = false
  addNewRow = false
  editingRows: RABGridData[] = []
  newRow: RABGridData = {}
  deletingRow: RABGridData = {}
  maxLengthMessageShow = false
  printData: RABGridData[][] = []
  deleteConfirmationLeft = '0px'
  deleteConfirmationTop = '0px'
  maximumReachedLeft = '0px'
  maximumReachedTop = '0px'
  callbackCalledList: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

  getConfig(conf: RABGridConf, columnName: string | null = null, index: number | null = null): any {
    switch(conf) {
      case RABGridConf.Responsiveness: {
        return this.config?.responsive ? true : false
      }

      case RABGridConf.Striped: {
        return this.config?.striped ? true : false
      }

      case RABGridConf.Parent: {
        return this.config?.parent;
      }

      case RABGridConf.Delete: {
        return this.config?.delete ? true : false
      }

      // Header
      case RABGridConf.HeaderOrder: {
        if(this.config?.header?.order.length) {
          return this.config.header.order
        } else if(this.data.length) {
          return Object.keys(this.data[0])
        } else {
          return []
        }
      }

      // Pagination
      case RABGridConf.PaginationEnable: {
        return this.config?.pagination?.enable ? true : false
      }

      case RABGridConf.PageSize: {
        return this.getConfig(RABGridConf.PaginationEnable) ?
          this.downloadMode ?
            this.data.length :
            this.config?.pagination?.pageSize ?
              Number(this.customPageSize) === this.config.pagination.pageSize ?
                this.config.pagination.pageSize :
                Number(this.customPageSize) === 0 ?
                  this.getConfig(RABGridConf.DataLength) ?
                    this.getConfig(RABGridConf.DataLength) :
                    this.data.length :
                  Number(this.customPageSize) :
              Number(this.customPageSize) === 0 ?
                this.getConfig(RABGridConf.DataLength) ?
                  this.getConfig(RABGridConf.DataLength) :
                  this.data.length :
                Number(this.customPageSize) :
          this.data.length
      }

      // Data
      case RABGridConf.DataLength: {
        return this.config?.data?.length ? this.config.data.length : 0
      }

      case RABGridConf.DataShowTotalRows: {
        return this.config?.data?.showTotalRows === false ? false : true
      }

      case RABGridConf.DataEdit: {
        return this.config?.data?.edit ? true : false
      }

      case RABGridConf.DataMaxRowCount: {
        return this.config?.data?.maxRowsCount ? this.config.data.maxRowsCount : 0
      }

      case RABGridConf.DataMaxRowCountExceedMessage: {
        return this.config?.data?.maxRowsCountExceedMessage ? this.config?.data?.maxRowsCountExceedMessage :
          `You can't add more than ${this.getConfig(RABGridConf.DataMaxRowCount)} data to the grid.`
      }

      case RABGridConf.DataExportEnable: {
        return this.config?.data?.export?.enable ? true : false
      }

      case RABGridConf.DataExportFileName: {
        return this.config?.data?.export?.fileName ? this.config.data.export.fileName : 'Grid Export'
      }

      case RABGridConf.DataExportTypes: {
        if(this.config?.data?.export?.types?.length) {
          const returnArr: RABGridExportMenuItem[] = []

          this.config.data.export.types.forEach(type => {
            if(type === 'pdf') {
              returnArr.push({
                name: 'PDF File',
                type: 'pdf',
                icon: 'bi bi-file-earmark-pdf-fill'
              })
            }

            if(type === 'xlsx') {
              returnArr.push({
                name: 'Excel File',
                type: 'xlsx',
                icon: 'bi bi-file-earmark-excel-fill'
              })
            }

            if(type === 'csv') {
              returnArr.push({
                name: 'CSV File',
                type: 'csv',
                icon: 'bi bi-file-earmark-spreadsheet'
              })
            }
          })

          return returnArr
        }else {
          return [{
            name: 'PDF File',
            type: 'pdf',
            icon: 'bi bi-file-earmark-pdf-fill'
          }, {
            name: 'Excel File',
            type: 'xlsx',
            icon: 'bi bi-file-earmark-excel-fill'
          }, {
            name: 'CSV File',
            type: 'csv',
            icon: 'bi bi-file-earmark-spreadsheet'
          }]
        }
      } break

      // Columns
      case RABGridConf.ColumnMinWidth: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.minWidth ?
          this.config.data.columns[columnName].minWidth : 'auto'
      }

      case RABGridConf.ColumnHeaderWhiteSpace: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.headerWhiteSpace ?
          this.config.data.columns[columnName].headerWhiteSpace : 'unset'
      }

      case RABGridConf.ColumnBodyWhiteSpace: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.bodyWhiteSpace ?
          this.config.data.columns[columnName].bodyWhiteSpace : 'unset'
      }

      case RABGridConf.ColumnAlign: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.align ?
          this.config.data.columns[columnName].align : 'left'
      }

      case RABGridConf.ColumnSort: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.sort ? true : false
      }

      case RABGridConf.ColumnName: {
        return columnName ?
          this.config?.data?.columns && this.config.data.columns[columnName]?.name ?
            this.config.data.columns[columnName].name :
            columnName :
          'Unknown'
      }

      case RABGridConf.ColumnEdit: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.edit === false ? false : true
      }

      case RABGridConf.ColumnBold: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.bold ? true : false
      }

      case RABGridConf.ColumnLinkEnable: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.link?.enable ? true : false
      }

      case RABGridConf.ColumnLinkCallback: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.link?.callback ?
          this.config.data.columns[columnName]?.link?.callback :
          (data: any, parent: any) => { console.error('Callback function is not provided.', data, parent)}
      }

      case RABGridConf.ColumnRound: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.round ?
          this.config.data.columns[columnName].round : 0
      }

      case RABGridConf.ColumnCommaSeparate: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.commaSeparate ? true : false
      }

      case RABGridConf.ColumnPrefix: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.prefix ?
          this.config.data.columns[columnName].prefix : null
      }

      case RABGridConf.ColumnSuffix: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.suffix ?
          this.config.data.columns[columnName].suffix : null
      }

      case RABGridConf.ColumnDisplayColumn: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.displayColumn ?
          this.config.data.columns[columnName].displayColumn : columnName
      }

      case RABGridConf.ColumnInputType: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.input?.type ?
          this.config.data.columns[columnName].input?.type : 'text'
      }

      case RABGridConf.ColumnInputOnChange: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.input?.onChange ?
          this.config.data.columns[columnName].input?.onChange : undefined
      }

      case RABGridConf.ColumnInputOptions: {
        if(columnName && this.editingRow && this.editingRow[columnName] && !this.callbackCalledList.includes(columnName)) {
          if(this.getConfig(RABGridConf.ColumnInputOnChange, columnName)) {
            this.callbackCalledList.push(columnName)
            this.getConfig(RABGridConf.ColumnInputOnChange, columnName)(this.getConfig(RABGridConf.Parent), this.editingRow[columnName])
          }
        }

        return this.config?.data?.columns && columnName && this.config.data.columns[columnName].input?.options ?
          this.config.data.columns[columnName].input?.options : []
      }

      case RABGridConf.ColumnInputValueField: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.input?.valueField ?
          this.config.data.columns[columnName].input?.valueField : 'value'
      }

      case RABGridConf.ColumnInputNameField: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.input?.nameField ?
          this.config.data.columns[columnName].input?.nameField : 'name'
      }

      case RABGridConf.ColumnInputOptionName: {
        if(this.config?.data?.columns && columnName && index !== null && this.config.data.columns[columnName].input?.options) {
          const options: RABGridConfigDataColumnInputOption[] =
            this.config.data.columns[columnName].input?.options as RABGridConfigDataColumnInputOption[]

          return options[index][this.getConfig(RABGridConf.ColumnInputNameField, columnName)] ?
            options[index][this.getConfig(RABGridConf.ColumnInputNameField, columnName)] :
            null
        }
        return null
      }

      case RABGridConf.ColumnInputOptionValue: {
        if(this.config?.data?.columns && columnName && index !== null && this.config.data.columns[columnName].input?.options) {
          const options: RABGridConfigDataColumnInputOption[] =
            this.config.data.columns[columnName].input?.options as RABGridConfigDataColumnInputOption[]

            return options[index][this.getConfig(RABGridConf.ColumnInputValueField, columnName)] ?
              options[index][this.getConfig(RABGridConf.ColumnInputValueField, columnName)] :
              this.getConfig(RABGridConf.ColumnInputOptionName, columnName, index)
        }
        return this.getConfig(RABGridConf.ColumnInputOptionName, columnName, index)
      }

      case RABGridConf.ColumnButtons: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.buttons?.length ?
          this.config.data.columns[columnName].buttons : []
      }

      case RABGridConf.ColumnDataType: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.dataType ?
          this.config.data.columns[columnName].dataType : 'string'
      }

      case RABGridConf.ColumnInputRequired: {
        return this.config?.data?.columns && columnName && this.config.data.columns[columnName]?.input?.required ? true : false
      }

      // Rows
      case RABGridConf.RowEdit: {
        return this.config?.data?.rows?.edit ? true : false
      }

      case RABGridConf.RowDelete: {
        return this.config?.data?.rows?.delete ? true : false
      }

      case RABGridConf.LastRowBold: {
        return this.config?.data?.rows?.lastRow?.bold ? true : false
      }

      case RABGridConf.RowAdd: {
        return this.config?.data?.rows?.add ? true : false
      }

      // Footer
      case RABGridConf.FooterEnable: {
        return this.config?.footer?.enable ? true : false
      }
    }
  }

  exportTo(type: any): void {
    if (type.type) {
      this.downloadMode = true
      this.pageSizeChange()
      this.getPrintData()

      setTimeout(() => {
        switch (type.type) {
          case 'pdf': {
            const DATA = document.getElementById('RABGrid-download-container')

            if(DATA) {
              html2canvas(DATA).then(canvas => {
                const fileWidth = 208
                const fileHeight = canvas.height * fileWidth / canvas.width
                let heightLeft = fileHeight

                const FILEURI = canvas.toDataURL('image/png')
                const PDF = new jsPDF('p', 'mm', 'a4')
                let position = 0
                PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

                heightLeft -= PDF.internal.pageSize.getHeight()
                position = heightLeft - fileHeight
                let heightM = 0;

                while(heightLeft >= 0) {
                  PDF.addPage();
                  PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight - heightM)
                  heightLeft -= PDF.internal.pageSize.getHeight()
                  position = heightLeft - fileHeight
                  heightM = 0
                }

                PDF.save(`${this.getConfig(RABGridConf.DataExportFileName)}.pdf`)

                this.downloadMode = false
                this.pageSizeChange()
              });
            }
          } break;

          case 'xlsx': {
            /* table id is passed over here */
            const element = document.getElementById('c-grid')
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)

            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

            /* save to file */
            XLSX.writeFile(wb, `${this.getConfig(RABGridConf.DataExportFileName)}.xlsx`)

            this.downloadMode = false
            this.pageSizeChange()
          } break;

          case 'csv': {
            // specify how you want to handle null values here
            const replacer = (key: any, value: any) => value === null ? '' : value;
            const header = this.getConfig(RABGridConf.HeaderOrder) ? this.getConfig(RABGridConf.HeaderOrder) : Object.keys(this.data[0])
            const csv = this.data.map(row => header.map((fieldName: string) => JSON.stringify(row[fieldName], replacer)).join(','))

            csv.unshift(header.join(','));

            const csvArray = csv.join('\r\n');

            const blob = new Blob([csvArray], { type: 'text/csv' })
            saveAs(blob, `${this.getConfig(RABGridConf.DataExportFileName)}.csv`)

            this.downloadMode = false
            this.pageSizeChange()
          } break;
        }
      }, 100);
    }
  }

  getPrintData(): void {
    let i = 0;
    let rowData: RABGridData[] = []
    this.printData = []

    while(i < this.data.length) {
      rowData.push(this.sortBy ? this.sortData[i++] : this.data[i++])

      if (!(i % 36)) {
        this.printData.push(rowData)
        rowData = []
      }
    }

    this.printData.push(rowData)
  }

  sort(column: string | null, emit = true): void {
    if(this.sortBy === column) {
      this.sortDirection++

      if(this.sortDirection >= 3) {
        this.sortDirection = 0
        this.sortBy = ''
      }
    }else if(column !== null) {
      this.sortBy = column
      this.sortDirection = 1
    }

    this.sortData = this.data.slice()
    this.sortData.sort((a, b) => {
      if(this.getConfig(RABGridConf.ColumnDataType, this.sortBy) === 'date'){
        return new Date(a[this.sortBy] as string).getTime() - new Date(b[this.sortBy] as string).getTime()
      }

      if(typeof a[this.sortBy] === 'number') {
        return (a[this.sortBy] as number) - (b[this.sortBy] as number)
      }

      return ('' + a[this.sortBy]).localeCompare(b[this.sortBy] as string)
    })

    if(this.sortDirection === 2) {
      this.sortData.reverse()
    }

    if(this.sortClick.observers.length && emit) {
      this.sortClick.emit({
        column: this.sortBy,
        type: this.sortDirection === 1 && this.sortBy !== '' ? 'asc' : this.sortDirection === 2 && this.sortBy !== '' ? 'desc' : 'none'
      })
    }

    this.changePage(this.page)
  }

  dataExceedOk(): void {
    this.maxLengthMessageShow = false;
  }

  changePage(page: number): void {
    this.page = page
    this.editingRow = {}

    this.pageData = []

    let start = this.getConfig(RABGridConf.PageSize) * this.page - this.getConfig(RABGridConf.PageSize)
    let end = (this.data.length > this.getConfig(RABGridConf.PageSize) ?
                  this.data.length > this.getConfig(RABGridConf.PageSize) * this.page ?
                    this.getConfig(RABGridConf.PageSize) * this.page :
                    this.data.length :
                  this.data.length)

    if(this.getConfig(RABGridConf.DataLength)) {
      start = 0
      end = this.getConfig(RABGridConf.PageSize) >= this.data.length ? this.data.length : this.getConfig(RABGridConf.PageSize)
    }

    for(let i = start; i < end; i++) {
      this.pageData.push(this.sortBy !== '' ? this.sortData[i] : this.data[i])
    }

    if(this.pageChanged.observers.length && this.getConfig(RABGridConf.DataLength) &&
      this.getConfig(RABGridConf.PageSize) * this.getConfig(RABGridConf.PageSize)) {

      this.pageChanged.emit(this.page)
    }
  }

  pageSizeChange(): void {
    if(this.getConfig(RABGridConf.PaginationEnable)) {
      this.pageNumbers = []

      let pagesC = (this.getConfig(RABGridConf.DataLength) ?
        this.getConfig(RABGridConf.DataLength) / this.getConfig(RABGridConf.PageSize) :
        this.data.length / this.getConfig(RABGridConf.PageSize))

      if((this.getConfig(RABGridConf.DataLength) ?
        this.getConfig(RABGridConf.DataLength) % this.getConfig(RABGridConf.PageSize) :
        this.data.length % this.getConfig(RABGridConf.PageSize)) > 0) {

        pagesC += 1;
      }

      for(let i = 1; i <= pagesC; i++) {
        this.pageNumbers.push(i)
      }

      if(!this.pageNumbers.includes(this.page)) {
        this.page = 1
      }

      this.changePage(this.page)

      if(this.pageSizeChanged.observers.length) {
        this.pageSizeChanged.emit(this.getConfig(RABGridConf.PageSize))
      }
    }
  }

  displayValue(data: any, key: any): string {
    let returnVal = data;

    if (data && this.config?.data?.columns && this.config.data.columns[key]) {
      if (this.getConfig(RABGridConf.ColumnRound, key) > 0 && !isNaN(data)) {
        returnVal = data.toFixed(this.getConfig(RABGridConf.ColumnRound, key))
      }

      if (this.getConfig(RABGridConf.ColumnCommaSeparate, key) && !isNaN(data)) {
        returnVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      if (this.getConfig(RABGridConf.ColumnPrefix, key)) {
        returnVal = `${this.getConfig(RABGridConf.ColumnPrefix, key)}${returnVal}`
      }

      if (this.getConfig(RABGridConf.ColumnSuffix, key)) {
        returnVal = `${returnVal}${this.getConfig(RABGridConf.ColumnSuffix, key)}`
      }
    }

    return returnVal;
  }

  deleteTable(): void {
    if (this.deleteAllClick.observers.length) {
      this.deleteAllClick.emit()
    }
  }

  addNew(e: MouseEvent): void {
    this.maximumReachedLeft = `${e.pageX}px`
    this.maximumReachedTop = `${e.clientY}px`

    this.emitAddNewClick()
    RABGrid.cancelEditAllGrids()
    const newRow: any = {}

    if(this.getConfig(RABGridConf.DataMaxRowCount) && this.data.length >= this.getConfig(RABGridConf.DataMaxRowCount)) {
      this.maxLengthMessageShow = true;
      return;
    }

    if(this.getConfig(RABGridConf.HeaderOrder)) {
      this.getConfig(RABGridConf.HeaderOrder).forEach((key: string) => {
        newRow[key] = null
      })
    }else {
      for(const key in this.data[0]) {
        if(key){
          newRow[key] = null
        }
      }
    }

    this._data.unshift(newRow)
    this.changePage(this.page)
    this.newRow = this.getConfig(RABGridConf.PaginationEnable) ? this.pageData[0] : this.data[0]
    this.addNewRow = true
  }

  saveNew(): void {
    let error = false

    Object.keys(this.newRow).forEach(key => {
      if((!this.newRow[key] || this.newRow[key] === '') && this.getConfig(RABGridConf.ColumnInputRequired, key)){
        error = true
        this.newRow.error += `${key} `
      }
    })

    if(!error){
      this.newRow.error = ''
      if (this.saveNewClick.observers.length) {
        this.saveNewClick.emit(this.newRow)
      }

      this._data.shift()
      this.changePage(this.page)
      this.newRow = {}
      this.addNewRow = false
    }
  }

  cancelNew(): void {
    if (this.cancelNewClick.observers.length) {
      this.cancelNewClick.emit()
    }

    this._data.shift()
    this.changePage(this.page)
    this.newRow = {}
    this.addNewRow = false
  }

  editAll(): void {
    this.cancelEdit()
    this.editingRows = this.getConfig(RABGridConf.PaginationEnable) ?
      JSON.parse(JSON.stringify(this.pageData)) : JSON.parse(JSON.stringify(this.data));;

    this.editingRows.forEach((row, index) => {
      Object.keys(row).forEach(key => {
        if(this.getConfig(RABGridConf.ColumnInputType, key) === 'dropdown' &&
          this.getConfig(RABGridConf.ColumnInputOptionValue, key, 0) !== this.getConfig(RABGridConf.ColumnInputOptionName, key, 0)) {

          const options = this.getConfig(RABGridConf.ColumnInputOptions, key) as RABGridConfigDataColumnInputOption[]

          for(const option of options) {
            if(option[this.getConfig(RABGridConf.ColumnInputNameField, key)] === row[key]) {
              this.editingRows[index][key] = option[this.getConfig(RABGridConf.ColumnInputValueField, key)]
            }
          }
        }
      })
    })

    this.editingAll = true
  }

  saveAll(): void {
    const editedRows: RABGridData[] = []
    let error = false

    this.editingRows.forEach((edited, index) => {
      Object.keys(edited).forEach(key => {
        if((!edited[key] || edited[key] === '') && this.getConfig(RABGridConf.ColumnInputRequired, key)){
          error = true
          this.editingRows[index].error += `${key} `
        }
      })

      if(JSON.stringify(this.getConfig(RABGridConf.PaginationEnable) ? this.pageData[index] : this.data[index]) !== JSON.stringify(edited)) {
        editedRows.push(edited)
      }
    });

    if(!error){
      if (this.saveAllClick.observers.length) {
        this.saveAllClick.emit(editedRows)
      }

      this.editingAll = false
      this.editingRows = []
    }
  }

  cancelAll(): void {
    this.editingAll = false
    this.editingRows = []
  }

  editRow(row: RABGridData): void {
    RABGrid.cancelEditAllGrids()
    this.callbackCalledList = []

    Object.keys(row).forEach(key => {
      try {
        if(this.config?.data?.columns) {
          (this.config.data.columns[key].input as any).callBackCalled = false
        }
      }catch(e) {}
    })

    this.cancelEdit()
    this.emitEditRowClick(row)
    this.editingRow = row
    this.nonEditedRow = JSON.parse(JSON.stringify(row))
  }

  saveRow(row: RABGridData): void {
    if (this.saveClick.observers.length) {
      this.saveClick.emit({
        old: row,
        new: this.editingRow
      })

      this.editingRow = {}
      this.nonEditedRow = {}
    }
  }

  cancelEdit(): void {
    for (const key in this.editingRow) {
      if(key) {
        this.editingRow[key] = this.nonEditedRow[key]
      }
    }

    this.editingRow = {}
    this.nonEditedRow = {}
  }

  deleteRow(e: MouseEvent, row: RABGridData): void {
    this.deleteConfirmationLeft = `${e.pageX}px`
    this.deleteConfirmationTop = `${e.clientY}px`
    this.deletingRow = row;
  }

  deleteNo(): void {
    this.deletingRow = {}
  }

  deleteYes(): void {
    if(this.deleteClick.observers.length) {
      this.deleteClick.emit(this.deletingRow)
    }

    this.deleteNo()
  }

  isValid(row: any, key: string): boolean {
    return row.error && (row.error as string).includes(key)
  }

  buttonClicked(id: number, row: RABGridData): void {
    if(this.buttonClick.observers.length){
      this.buttonClick.emit({ id, row })
    }
  }

  emitEditRowClick(row: RABGridData): void {
    if (this.editRowClick.observers.length) {
      this.editRowClick.emit(row)
    }
  }

  emitCellClick(row: RABGridData, column: string, value: any): void {
    if (this.cellClick.observers.length) {
      this.cellClick.emit({ row, cell: { key: column, value } })
    }
  }

  emitColumnOnChange($event: any, column: string, value: any): void {
    if(this.getConfig(RABGridConf.ColumnInputOnChange, column)) {
      this.getConfig(RABGridConf.ColumnInputOnChange, column)(this.getConfig(RABGridConf.Parent), value)
    }
  }

  emitAddNewClick(): void {
    if (this.addNewClick.observers.length) {
      this.addNewClick.emit()
    }
  }
}
