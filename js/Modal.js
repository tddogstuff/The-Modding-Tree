/** 
*Create a modal , which is used for pop-up
**/
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal.querySelector('.close');
        this.isOpen = false;
        this.agreed = false;
        this.textColor = 'red';

        this.textBox = null;
        this.confirmButton = null;

        this.closeBtn.onclick = () => this.close();
        window.onclick = (event) => {
            if (event.target == this.modal) {
                this.close();
            }
        };
    }
/** 
*Open the modal
**/
    open() {
        this.modal.style.display = 'block';
        this.isOpen = true;
    }
/** 
*Close the modal
**/
    close() {
        this.modal.style.display = 'none';
        this.isOpen = false;
    }
/** 
*Confirm is activated when the user press the confirm button , set textBox to true , and an optional callback function may be performed
**/
    confirm(callback) {
        if (this.textBox) {
            const textBoxValue = this.textBox.value;
        }
        if(isFunction(callback)) {
          callback()
        }
        this.agreed = true
        this.close();
    }
/** 
*Set the content , and optional content such as textBox and confirmButton
**/
    setContent(content, options = {}) {
        this.textBox = null
        this.agreed = false
        const contentDiv = this.modal.querySelector('.modal-content');
        contentDiv.style.color = this.textColor;
        const closeButton = this.closeBtn.cloneNode(true);

        contentDiv.innerHTML = ''; 
        contentDiv.appendChild(closeButton); 

        if (options.textBox) {
            this.textBox = document.createElement('input');
            this.textBox.classList.add('modal-textbox');
            this.textBox.style.display = 'block';
            contentDiv.appendChild(this.textBox);
        }

        if (options.confirmButton) {
            this.confirmButton = document.createElement('button');
            this.confirmButton.textContent = 'Confirm';
            this.confirmButton.classList.add('modal-confirm');
            this.confirmButton.style.display = 'block';
            contentDiv.appendChild(this.confirmButton);

            this.confirmButton.onclick = () => this.confirm();
        }

        contentDiv.appendChild(document.createTextNode(content));
    }
}
/** 
*Do not change this for any reason
**/
const modal = new Modal('modal');

/** 
*Show a modal , use h2 elements ; and optional features such as textBox , confirmButton , color , callback function
**/
function showModal(HTMLheader, HTMLcontent, options = { textBox: false, confirmButton: false, textColor: 'red'} , callback) {
    if(options.textColor === undefined) options.textColor = 'red'
    modal.textColor = options.textColor
    const headerElement = document.createElement('h2');
    const contentElement = document.createElement('p');

    headerElement.textContent = HTMLheader;
    contentElement.textContent = HTMLcontent;

    modal.setContent('', { textBox: options.textBox, confirmButton: options.confirmButton });
    const contentDiv = modal.modal.querySelector('.modal-content');
    contentDiv.prepend(headerElement, contentElement);

    if (options.confirmButton) {
      modal.confirmButton.onclick = () => modal.confirm(callback);
    }

    modal.open();
}