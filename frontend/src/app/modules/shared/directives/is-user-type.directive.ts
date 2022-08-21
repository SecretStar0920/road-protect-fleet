import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { Store } from '@ngrx/store';
import { some } from 'lodash';

@Directive({
    selector: '[rpIsUserType]',
})
export class IsUserTypeDirective {
    private userTypes: UserType[];
    private user: User;
    private alternateTemplate: TemplateRef<any>;

    @Input()
    set rpIsUserType(value: UserType[]) {
        this.userTypes = value;
        this.updateView();
    }

    // The else value that the directive takes
    @Input()
    set rpIsUserTypeElse(value) {
        this.alternateTemplate = value;
        this.updateView();
    }

    constructor(
        private readonly viewContainer: ViewContainerRef,
        private readonly intendedTemplate: TemplateRef<any>,
        private store: Store<AuthState>,
    ) {
        this.store.select(currentUser).subscribe((user) => {
            this.user = user;
            if (this.user) {
                this.updateView();
            }
        });
    }

    private updateView() {
        // Always clear the view container
        this.viewContainer.clear();

        if (some(this.userTypes, (userType) => userType === this.user.type)) {
            // If the user has permissions, create the view
            this.viewContainer.createEmbeddedView(this.intendedTemplate);
        } else if (this.alternateTemplate) {
            this.viewContainer.createEmbeddedView(this.alternateTemplate);
        }
    }
}
