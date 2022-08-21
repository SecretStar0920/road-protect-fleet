
const frontendSrc = `frontend/src/app`;
const frontendCrudModuleActions = [
    {
        type: `addMany`,
        destination: `${frontendSrc}/{{path}}/{{dashCase name}}`,
        templateFiles: `templates/frontend/crud/**/*.hbs`,
        base: `templates/frontend/crud`,
    },
];

const backendSrc = `backend/src`;
const backendTest = `backend/test`;
const backendCrudModuleActions = [
    {
        type: `addMany`,
        destination: `${backendSrc}/{{path}}/{{dashCase name}}`,
        templateFiles: `templates/backend/crud/**/*.hbs`,
        base: `templates/backend/crud`,
    },
];

module.exports = plop => {
    plop.setGenerator(`Entity Crud [ Backend ]`, {
        description: `Create a backend crud module for an entity`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the backend module?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/src/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: backendCrudModuleActions,
    });

    // FIXME: OUTDATED
    plop.setGenerator(`Entity Crud [ Frontend ]`, {
        description: `Create a frontend crud module for an entity`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the frontend module?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to frontend/src/app/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: frontendCrudModuleActions,
    });

    plop.setGenerator(`Entity Crud [ Full Stack ]`, {
        description: `Create a backend & frontend crud module for an entity`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the entity / resource?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/src/ & frontend/src/app/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: [...backendCrudModuleActions, ...frontendCrudModuleActions],
    });

    // FIXME: OUTDATED
    plop.setGenerator(`Entity Spreadsheet Upload [ Full Stack ]`, {
        description: `Adds spreadsheet upload to a base module`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the entity / resource?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/src/ & frontend/src/app/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: [
            // Backend
            {
                type: `addMany`,
                destination: `${backendSrc}/{{path}}/{{dashCase name}}`,
                templateFiles: `templates/backend/spreadsheet/**/*.hbs`,
                base: `templates/backend/spreadsheet`,
            },
            // Frontend
            {
                type: `addMany`,
                destination: `${frontendSrc}/{{path}}/{{dashCase name}}`,
                templateFiles: `templates/frontend/spreadsheet/**/*.hbs`,
                base: `templates/frontend/spreadsheet`,
            },
        ],
    });

    plop.setGenerator(`Entity Query API [ Backend ]`, {
        description: `Adds a query API to the backend for a given resource`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the entity / resource?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/src/ & frontend/src/app/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: [
            // Backend
            {
                type: `addMany`,
                destination: `${backendSrc}/{{path}}/{{dashCase name}}`,
                templateFiles: `templates/backend/query/**/*.hbs`,
                base: `templates/backend/query`,
            },
        ],
    });

    plop.setGenerator(`Entity Query API [ Frontend ]`, {
        description: `Adds a frontend paginated filter component`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the entity / resource?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/src/ & frontend/src/app/) (Eg: "modules/PARENT_MODULE/modules")`,
                default: `modules`,
            },
        ],
        actions: [
            // Frontend
            {
                type: `addMany`,
                destination: `${frontendSrc}/{{path}}/{{dashCase name}}`,
                templateFiles: `templates/frontend/query/**/*.hbs`,
                base: `templates/frontend/query`,
            },
        ],
    });

    plop.setGenerator(`Service Unit Test [ Backend ]`, {
        description: `Adds a unit testing file for a service`,
        prompts: [
            {
                type: `input`,
                name: `name`,
                message: `What is the name of the service? Eg: CreateInfringement (don't include the service)`,
            },
            {
                type: `input`,
                name: `path`,
                message: `Where should it be created? (Relative to backend/test/)`,
            },
        ],
        actions: [
            // Backend
            {
                type: `addMany`,
                destination: `${backendTest}/{{path}}/`,
                templateFiles: `templates/backend/testing/**/*.hbs`,
                base: `templates/backend/testing`,
            },
        ],
    });

};
