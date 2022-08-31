import React from 'react';

type Note = {
  id : number;
  title: string;
  body: string;
  created: Date;
  lastModified: Date;
};

type Translations = {
  searchBar: string,
  emptyNotes: string,
  failedSave: string,
  newNote: string
};

export {
  Note,
  Translations
};