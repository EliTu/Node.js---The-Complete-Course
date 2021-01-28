var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Queries
const message = document.querySelector('.message');
const filePicker = document.querySelector('.file-picker-input');
const deleteButton = document.querySelector('#product-delete-button');
const fileNameLabel = document.querySelector('.file-name');
/**
 * a simple util to find and hide the popout success or error message in the UI after 8 seconds.
 */
if (message) {
    setTimeout(() => {
        message.style.display = 'none';
    }, 8000);
}
/**
 *  a util to set the file picker input label text value when picking a file with the input.
 * */
if (filePicker) {
    filePicker.onchange = () => {
        if (filePicker.files.length > 0) {
            const { name } = filePicker.files[0];
            fileNameLabel.textContent = name;
        }
    };
}
/**
 * an async util function to make an async request to delete a product from the admin products list.
 * @param {*} btn The button input that was clicked, accessed via the native onclick function.
 */
const deleteProduct = (btn) => __awaiter(this, void 0, void 0, function* () {
    // access the clicked button element parent first
    const buttonParent = btn.parentNode;
    // get the data hidden inputs
    const hiddenInputs = buttonParent.querySelectorAll('[type="hidden"]');
    const inputValues = {};
    // create a mapped object of the values by input name
    for (const { name, value } of hiddenInputs) {
        inputValues[name] = value;
    }
    if (Object.keys(inputValues).length) {
        const { deletedProductId: productId, _csrf } = inputValues;
        try {
            const response = yield fetch(`/admin/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    // the csurf package will not only check request bodies for csrf tokens, but also headers
                    'csrf-token': _csrf,
                },
            });
            const deleteResBody = yield response.json();
            // simultaneously remove a product item from the DOM
            if (response.status === 200) {
                const productElementNode = btn.closest('article'); // find the nearest article to the button which is the product item element
                if (productElementNode)
                    productElementNode.remove();
                // handle pagination links in case all items have been removed
                const productElementList = document.querySelectorAll('.product-item');
                if (productElementList.length === 0) {
                    const activePaginationElement = document.querySelector('.pagination > a.active');
                    if (activePaginationElement) {
                        activePaginationElement.remove();
                        document.getElementById('prev-arrow').click(); // find and click on the previous page arrow to navigate to a new page
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
});
//# sourceMappingURL=domUtils.js.map