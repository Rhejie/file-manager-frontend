export const setTitle = (title) => {
    const siteName = process.env.VUE_APP_TITLE;
    const titleEl = document.querySelector('head title');
    if(title) {
        let name = siteName ? siteName : 'File Manager';
        titleEl.textContent = name + ' - ' + title;
    }
}