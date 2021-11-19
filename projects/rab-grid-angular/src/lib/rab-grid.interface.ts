/** C-Grid Data */
export interface RABGridData {
    [key: string]: string | number | null | undefined | Date
}

export interface RABGridCellClickOut {
    row: RABGridData,
    cell: RABGridCellClickOutCell
}

export interface RABGridButtonClickOut {
    id: number
    row: RABGridData
}

export interface RABGridSaveRowClickOut {
    old: RABGridData
    new: RABGridData
}

export interface RABGridExportMenuItem {
    name: string
    type: 'pdf' | 'xlsx' | 'csv'
    icon: string
}

export interface RABGridSortClickOut {
    column: string
    type: 'asc' | 'desc' | 'none'
}

interface RABGridCellClickOutCell {
    key: string,
    value: string | number | null | undefined | Date
}

/** C-Grid Configurations */
export interface RABGridConfig {
    /** Data configurations */
    data?: RABGridConfigData
    /** Set true to enable table delete button */
    delete?: boolean
    /** Footer configurations */
    footer?: RABGridConfigFooter
    /** Header configurations */
    header?: RABGridConfigHeader
    /** Pagination config */
    pagination?: RABGridConfigPagination
    /** Parent of the table to be returned as parent in the function calls */
    parent?: any
    /** Set true to enable responsiveness. Default is false. */
    responsive?: boolean
    /** Set true to enable table strips. Default is false. */
    striped?: boolean
}

export interface RABGridCallBackList {
    [key: string]: {callBackCalled: boolean}
}

interface RABGridConfigFooter {
    enable: boolean
}

interface RABGridConfigHeader {
    /** Put headers in the order that you required. */
    order: string[]
}

interface RABGridConfigData {
    /** Columns configurations */
    columns?: RABGridConfigDataColumns
    /** Set true to enable page edit. Default is false */
    edit?: boolean
    /** Data export configurations */
    export?: RABGridConfigDataExport
    /** Set data length if want to set a custom data size (Pagination purposes) */
    length?: number
    /** If a value is set, user can't add more data if the rows count is exceeded */
    maxRowsCount?: number
    /** Set a message to display when user tries to exceed max rows count */
    maxRowsCountExceedMessage?: string
    /** Rows configurations */
    rows?: RABGridConfigDataRows
    /** Set false to hide total data count */
    showTotalRows?: boolean
}

type ExportTypes = 'pdf' | 'xlsx' | 'csv'

interface RABGridConfigDataExport {
    /** Set true to enable exporting data */
    enable: boolean
    /** Set the file name for export */
    fileName?: string
    /** Export types */
    types?: ExportTypes[]
}

interface RABGridConfigDataColumns {
    /** Column configurations. Key name should be exactly as keys in the data set. */
    [key: string]: RABGridConfigDataColumn
}

interface RABGridConfigDataColumn {
    /** Column alignment */
    align?: 'left' | 'right' | 'center'
    /** Set true to bold the column. Default value is false */
    bold?: boolean
    /** Column buttons configurations */
    buttons?: RABGridConfigDataColumnButtons[]
    /** Set true to separate each 3 digits by a comma (Applicable for numbers only) */
    commaSeparate?: boolean
    /** Data type for sorting */
    dataType?: 'string' | 'date' | 'number'
    /** If want to use the value of a different column in view */
    displayColumn?: string
    /** Set false to disable editing for the column. Default value is true */
    edit?: boolean
    /** Set the header whitespace property */
    headerWhiteSpace?: 'break-space' | 'none' | 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'revert' | 'unset'
    /** Set the body whitespace property */
    bodyWhiteSpace?: 'break-space' | 'none' | 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'revert' | 'unset'
    /** Input configurations */
    input?: RABGridConfigDataColumnInput
    /** Link configurations */
    link?: RABGridConfigDataColumnLink
    /** Custom column name */
    name?: string
    /** Set column prefix */
    prefix?: string
    /** Set a value to round up numbers to decimal points */
    round?: number
    /** Set true to enable sorting. Default is false. */
    sort?: boolean
    /** Set column suffix */
    suffix?: string
    /** Set column width in (px, %, vw, em, vh, rem) */
    minWidth?: string
}

interface RABGridConfigDataColumnButtons {
    /** ID name (This will be used to identify the clicked button) */
    id: string
    /** FA Icons */
    icon?: string[]
    /** Set true to hide the button on a new row. Default is false */
    hideOnNew?: boolean
    /** Icon classes */
    class?: string
}

interface RABGridConfigDataColumnInput {
    /** Value field name of the input options. Default is name  */
    nameField?: string
    /** Dropdown options */
    options?: RABGridConfigDataColumnInputOption[]
    /** Input on change function */
    onChange?: (parent: any, value: any) => void
    /** Set true to make this a required field */
    required?: boolean
    /** Input type */
    type?: 'text' | 'number' | 'email' | 'dropdown'
    /** Value field name of the input options. Default is value */
    valueField?: string
}

export interface RABGridConfigDataColumnInputOption {
    [key: string]: string | number
}

interface RABGridConfigDataColumnLink {
    /** Set true to enable link. Default value is false */
    enable: boolean
    /** Link click callback function */
    callback?: (data: RABGridData, parent: any) => void
}

interface RABGridConfigDataRows {
    /** Set true to enable row add */
    add?: boolean
    /** Set true to enable row edit mode. Default is false. */
    edit?: boolean
    /** Set true to enable row delete mode. Default is false. */
    delete?: boolean
    /** Last row configurations */
    lastRow?: RABGridConfigDataLastRow
}

interface RABGridConfigDataLastRow {
    /** Set true to bold the last row. Default is false */
    bold?: boolean
}

interface RABGridConfigPagination {
    /** Set true to enable pagination. Default is false */
    enable: boolean
    /** Set custom page size. Default is 10 */
    pageSize?: number
}