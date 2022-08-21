import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    isSidebarCollapsed: boolean = false;

    constructor() {}

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
}
