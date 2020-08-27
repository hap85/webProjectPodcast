import Api from './api.js';
import page from '//unpkg.com/page/page.mjs';

class Filter {
    constructor(sidebarContainer, dropdownSearch){
        this.sidebarContainer = sidebarContainer;
        this.dropdownSearch = dropdownSearch;
        this.onFilterSelected = this.onFilterSelected.bind(this);
        this.onFilterSearchSelected = this.onFilterSearchSelected.bind(this);
        this.sidebarContainer.querySelectorAll('.categorie-link').forEach(link => {
            link.addEventListener('click', this.onFilterSelected);
        });
        
    }

    onFilterSelected(event){
        event.preventDefault();
        // the HTML element that was clicked
        
        const el = event.target;
        
        // the 'data-id' property of that element
        const filterTitle = el.innerText;
        
        console.log(filterTitle);
        if(filterTitle==="Tutte le serie") page.redirect('/series');
        else page.redirect('/series/categorie/'+filterTitle);
        // removing and adding the 'active' class
        this.sidebarContainer.querySelector('a.active').classList.remove('active');
        el.classList.add('active');       
    }
    onFilterSearchSelected(event){
        event.preventDefault();
        const el = event.target;
        this.dropdownSearch.querySelector('a.active').classList.remove('active');
        el.classList.add('active');  
        document.getElementById('text-categorie').innerText = el.innerText;
    }
    
}
export default Filter;