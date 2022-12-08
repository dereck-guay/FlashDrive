class Dialog {
    constructor(params) {
        this.isHidden = true;

        this.width = params.width || '80vw';
        this.header = params.header;
        this.body = params.body;
        this.footer = params.footer;

        this.dialogContainerElement = undefined;
        this.dialogElement = undefined;
        this.HeaderElement = undefined;
        this.BodyElement = undefined;
        this.footerElement = undefined;

        this._id = '_' + Math.random().toString(26).substring(2, 10);

        this.render();
    }

    render() {
        let body = document.querySelector('body');
        this.dialogContainerElement = document.createElement('div');
        let containerDiv = document.createElement('div');
        this.dialogElement = document.createElement('div');
        this.HeaderElement = document.createElement('div');
        this.BodyElement = document.createElement('div');
        this.footerElement = document.createElement('div');

        this.dialogContainerElement.id = this._id;
        this.dialogContainerElement.className = 'dialog-container hidden';
        containerDiv.className = 'flex items-center justify-center h-full';
        this.dialogElement.className = 'dialog';
        this.dialogElement.style.width = this.width;
        this.HeaderElement.className = 'dialog-header';
        this.BodyElement.className = 'dialog-body';
        this.footerElement.className = 'dialog-footer';

        this.header(this.HeaderElement, this);
        this.body(this.BodyElement, this);
        this.footer(this.footerElement, this);

        this.dialogElement.append(this.HeaderElement, this.BodyElement, this.footerElement);
        containerDiv.append(this.dialogElement);
        this.dialogContainerElement.append(containerDiv);
        body.append(this.dialogContainerElement);
    }

    toggle() {
        if (this.isHidden) {
            this.show();
            return
        }
        this.hide();
    }

    show() {
        document.querySelector(`#${this._id}`).classList.remove('hidden');
        this.isHidden = false;
    }

    hide() {
        document.querySelector(`#${this._id}`).classList.add('hidden');
        this.isHidden = true;
    }
}

function showLoading(element = undefined, text = undefined) {
    let loadingId = '_' + Math.random().toString(26).substring(2, 10);
    let target = element || document.body;

    target.classList.add('relative');

    let loadingContainer = document.createElement('div');
    let loadingIcon = document.createElement('div');
    let loadingText = document.createElement('div');

    loadingIcon.className = 'loading-icon';
    loadingIcon.innerHTML = '<i class="fa-solid fa-spinner"></i>';

    loadingText.className = 'loading-text';
    loadingText.innerHTML = text || 'Loading...';

    loadingContainer.className = 'loading';
    loadingContainer.id = loadingId;
    loadingContainer.append(loadingIcon, loadingText);

    target.append(loadingContainer);

    return loadingId;
}

function hideLoading(loadingId) {
    let loadingElement = document.querySelector(`#${loadingId}`);
    if (loadingElement == undefined) return;

    loadingElement.parentNode.classList.remove('relative');
    loadingElement.remove();
}
