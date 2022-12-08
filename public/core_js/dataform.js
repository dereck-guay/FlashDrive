class DataForm extends DatasetComponent {
    constructor(params) {
        super(params.dataset, params.containerElement);

        // Private Properties
        this._title = params.title;
        this._fields = params.fields;

        // Callbacks
        this.onRowClicked = params.onRowClick;

        // Loading
        this.render();
    }

    // DataForm Events
    onChange(dto) {
        // console.log(dto);
    }

    //Public Methods
    render() {
        this.containerElement.classList.add('dataset_form');
        let bodyElement = document.createElement('div');
        bodyElement.classList.add('dataset_form_body');

        for (let field of this._fields) {
            let dataformFieldContainer = document.createElement('div');

            new DataField({
                dataset: this.dataset,
                containerElement: dataformFieldContainer,
                onChange: dto => {
                    this.onChange(dto)
                },
                ...field,
            });

            bodyElement.append(dataformFieldContainer);
        }

        let footerElement = document.createElement('div');
        footerElement.classList.add('dataset_form_footer');
        let saveBtn = document.createElement('button');
        let cancelBtn = document.createElement('button');
        footerElement.append(saveBtn, cancelBtn);

        saveBtn.classList = 'btn btn-primary';
        cancelBtn.classList = 'btn btn-secondary';

        saveBtn.innerHTML = 'Save <i class="fa-solid fa-save"></i>'
        cancelBtn.innerHTML = 'Cancel <i class="fa-solid fa-ban"></i>'

        saveBtn.onclick = e => this.dataset.save();
        cancelBtn.onclick = e => this.dataset.cancel();

        this.containerElement.append(bodyElement, footerElement);

        if (this._title == undefined) return;
        let titleElement = document.createElement('div');
        titleElement.classList.add('dataset_form_title');

        if (this._title instanceof Function) titleElement.innerHTML = this._title(dataset);
        else if (typeof(this._title) == 'string') titleElement.innerHTML = this._title;

        this.containerElement.prepend(titleElement);
    }
}
