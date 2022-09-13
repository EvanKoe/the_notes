import React from 'react';

type Note = {
  id: number;
  title: string;
  body: string;
  created: Date;
  lastModified: Date;
};

type Translations = {
  searchBar: string,
  emptyNotes: string,
  failedSave: string,
  newNote: string,
  deleted: string,
  settingsTitle: string,
  settingsLang: string,
  error: string,
  removeNoteTitle: string,
  removeNoteBody: string,
  removeNoteYes: string,
  removeNoteNo: string,
  noteTitle: string,
  noteBody: string,
  lastModified: string,
  noData: string
};

type DialogData = {
  title?: string,
  body: string,
  yesButton: string,
  noButton?: string,
  action?: () => void
};

type SettingsStorage = {
  language: Translations
};

export {
  Note,
  Translations,
  DialogData,
  SettingsStorage
};
