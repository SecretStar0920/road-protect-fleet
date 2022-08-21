import { NominationStatus } from '@modules/shared/models/entities/nomination.model';

export interface INominationStatusQuestion {
    text: string;
    yesId: NominationStatusQuestionIds;
    noId: NominationStatusQuestionIds;
    selectedNominationStatus: NominationStatus;
}

export interface INominationStatusQuestions {
    [key: string]: INominationStatusQuestion;
}

export enum NominationStatusQuestionIds {
    isInRedirection,
    isRedirectionCompleted,
    isClosed,
    inRedirection,
    redirectionCompleted,
    closed,
    acknowledged,
}

// Decision tree questions for being able to update to any nomination status are in PR 285, 282, 270, 269, 262

export const nominationStatusQuestionsObject: INominationStatusQuestions = {
    [NominationStatusQuestionIds.isInRedirection]: {
        text: 'Is the infringement in the redirection process?',
        yesId: NominationStatusQuestionIds.isRedirectionCompleted,
        noId: NominationStatusQuestionIds.isClosed,
        selectedNominationStatus: null,
    },
    [NominationStatusQuestionIds.isRedirectionCompleted]: {
        text: 'Has the redirection process been completed?',
        yesId: NominationStatusQuestionIds.redirectionCompleted,
        noId: NominationStatusQuestionIds.inRedirection,
        selectedNominationStatus: null,
    },
    [NominationStatusQuestionIds.redirectionCompleted]: {
        text: null,
        yesId: null,
        noId: null,
        selectedNominationStatus: NominationStatus.RedirectionCompleted,
    },
    [NominationStatusQuestionIds.inRedirection]: {
        text: null,
        yesId: null,
        noId: null,
        selectedNominationStatus: NominationStatus.InRedirectionProcess,
    },
    [NominationStatusQuestionIds.isClosed]: {
        text: 'Has the infringement been closed?',
        yesId: NominationStatusQuestionIds.closed,
        noId: NominationStatusQuestionIds.acknowledged,
        selectedNominationStatus: null,
    },
    [NominationStatusQuestionIds.closed]: {
        text: null,
        yesId: null,
        noId: null,
        selectedNominationStatus: NominationStatus.Closed,
    },
    [NominationStatusQuestionIds.acknowledged]: {
        text: null,
        yesId: null,
        noId: null,
        selectedNominationStatus: NominationStatus.Acknowledged,
    },
};
