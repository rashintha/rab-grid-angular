export class RABGrid {
  public static cancelEditAllGrids(): void {
    document.querySelectorAll('.rabgrid-cancel-edit-row').forEach(element => {
      (element as HTMLElement).click()
    })

    document.querySelectorAll('.rabgrid-cancel-new').forEach(element => {
      (element as HTMLElement).click()
    })

    document.querySelectorAll('.rabgrid-cancel-all').forEach(element => {
      (element as HTMLElement).click()
    })
  }

  public static disableAllTableButtons(): void {
    document.querySelectorAll('.rabgrid-add-new').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-edit-all').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-save-all').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-cancel-all').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-save-new').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-cancel-new').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-export').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-delete-table').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-edit-row').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-delete-row').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-save-row').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })

    document.querySelectorAll('.rabgrid-cancel-edit-row').forEach(element => {
      (element as HTMLElement).setAttribute('disabled', 'true')
    })
  }

  public static enableAllTableButtons(): void {
    document.querySelectorAll('.rabgrid-add-new').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-edit-all').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-save-all').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-cancel-all').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-save-new').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-cancel-new').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-export').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-delete-table').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-edit-row').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-delete-row').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-save-row').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })

    document.querySelectorAll('.rabgrid-cancel-edit-row').forEach(element => {
      (element as HTMLElement).removeAttribute('disabled')
    })
  }
}