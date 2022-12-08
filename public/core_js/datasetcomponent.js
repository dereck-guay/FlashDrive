class DatasetComponent {
    initialize() {
        if (this.dataset == undefined) return;
        this.dataset.addChildComponent(this);
    }

    constructor(dataset, containerElement) {
        // Public Properties
        this.dataset = dataset;
        this.containerElement = containerElement;
    }

    // Dataset Events
    datasetOnReady(dto) {
        this.render();
    }
}
