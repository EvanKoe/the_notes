//! Standard imports
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Keyboard,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//? Icons
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { DialogData, Note, Translations } from '../Types/types';
import { eng, fr, langToText } from '../translations/translations';
import { STORAGE_KEY, SETTINGS_KEY } from '../globals';
import truncate from '../Functions/truncate';

//TODO Add languages
//TODO Add menu with settings
//TODO Add backend for search bar

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Main = ({ navigation }: any) => {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<Note[] | undefined>([]);
  const [isModalDisplayed, setIfModalDisplayed] = useState<boolean>(false);
  const [lang, setLang] = useState<Translations>(eng);
  const [current, setCurrent] = useState<Note | undefined>(undefined);
  const _titleRef = useRef<TextInput>(null);
  const _bodyRef = useRef<TextInput>(null);
  const [dialog, setDialog] = useState<DialogData | undefined>(undefined);

  const save = async () => {
    if (current === undefined) {
      return;
    }
    let i: number = -1;
    let a: Note[] = []

    notes?.map((item: Note) => {
      if (item.id === current.id) {
        i = item.id;
        notes[i] = current;
        a = notes;
        return;
      }
    });
    if (notes === undefined) {
      a = [current];
    } else if (i === -1) {
      a = notes?.concat([current]);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    return setNotes(a);
  }

  const getItem = (title: string | undefined, body: string | undefined) => {
    return (current === undefined) ? ({
      // if new note
      id: notes === undefined || notes?.length === 0 ? 0 : notes[notes?.length - 1].id + 1,
      title: title ?? lang.newNote,
      body: body ?? lang.newNote,
      created: new Date(Date.now()),
      lastModified: new Date(Date.now())
    }) : ({
      // if already saved note
      id: current.id,
      title: title ?? current.title,
      body: body ?? current.body,
      created: current.created,
      lastModified: new Date(Date.now())
    });
  }

  const remove = () => {
    let a: Note[] | undefined = [];
    a = notes?.filter((note: Note) => note.id !== current?.id);
    setNotes(a);
    setDialog(undefined);
    setIfModalDisplayed(false);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    ToastAndroid.show(lang.deleted, ToastAndroid.SHORT);
  }

  useEffect(() => {
    if (isModalDisplayed) {
      return;
    }
    setCurrent(undefined);
  }, [isModalDisplayed]);

  useEffect(() => {
    const fun = async () => {
      const promise = await AsyncStorage.getItem(STORAGE_KEY);
      setNotes((promise === null) ? [] : JSON.parse(promise));
      console.log(notes)

      const promise2 = await AsyncStorage.getItem(SETTINGS_KEY);
      if (promise2 === null) {
        return console.log("pute")
      }
      const json = JSON.parse(promise2).language;
      setLang({ ...json });
      console.log(json.deleted)
      console.log(lang.deleted)
    };

    fun();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={async () => {
        setNotes([]);
        await AsyncStorage.clear();
      }}>
        <Text>Pute</Text></TouchableOpacity>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('settings')}
        >
          <Feather
            name="menu"
            size={24}
            color="#ddd"
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder={lang.searchBar}
          placeholderTextColor='#bbb'
          onChangeText={(e) => setSearchValue(e)}
          style={styles.searchInput}
        />
      </View>

      {/* Displaying notes */}
      {notes === undefined || notes?.length === 0 ? (
        <Text style={styles.emptyNotesText}>This looks empty !</Text>
      ) : (
        <FlatList
          numColumns={2}
          data={notes}
          keyExtractor={(item: Note, index: number) => 'note' + index.toString()}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item, index }: ListRenderItemInfo<Note>) => (
            <TouchableOpacity
              style={styles.noteTile}
              onPress={() => {
                setCurrent({ ...notes[index] })
                setIfModalDisplayed(true)
              }}
            >
              <Text style={styles.noteTileTitle}>{truncate(item.title, 20)}</Text>
              <Text style={styles.noteTileBody}>{truncate(item.body, 20)}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add note button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          // If modal not displayed, then user pressed '+', so new note
          if (isModalDisplayed) {
            save();
          }
          setIfModalDisplayed(e => !e)
        }}
      >
        <AntDesign
          name={!isModalDisplayed ? "plus" : current === undefined ? "close" : "save"}
          size={30}
          color="#ddd"
          style={styles.floatingButtonIcon}
        />
      </TouchableOpacity>

      {/* Modal new note */}
      {isModalDisplayed && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
          style={styles.newNoteBg}
        >
          <View style={styles.newNoteView}>
            <TextInput
              ref={_titleRef}
              placeholder={lang.noteTitle}
              placeholderTextColor='#4C8EDB77'
              style={styles.noteTitle}
              value={current?.title}
              onChangeText={(e: string) => setCurrent(getItem(e, undefined))}
            />
            <TextInput
              ref={_bodyRef}
              placeholder={lang.noteBody}
              autoFocus={current === undefined}
              multiline
              numberOfLines={30}
              placeholderTextColor='#ddd7'
              style={styles.noteBody}
              value={current?.body}
              onChangeText={(e: string) => setCurrent(getItem(undefined, e))}
            />
          </View>

          {/* Action bar */}
          <View style={styles.actionBar}>
            {/* Delete note button */}
            <TouchableOpacity
              onPress={() => setDialog({
                title: lang.removeNoteTitle,
                body: lang.removeNoteBody,
                yesButton: lang.removeNoteYes,
                noButton: lang.removeNoteNo,
                action: remove
              })}
              style={styles.actionBarButton}
            >
              <Feather name="trash" size={24} color="#bbb" />
            </TouchableOpacity>

            {/* Add tab button */}
            <View style={styles.actionBarLastModifiedView}>
              <Text style={{ color: '#bbb', fontSize: 12 }}>{lang.lastModified}</Text>
              <Text style={{ color: '#bbb', fontSize: 12 }}>{/*current?.lastModified.toDateString() ?? */lang.noData}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Dialog */}
      {dialog !== undefined && (
        <View style={styles.dialog}>
          <View style={styles.dialogFg}>
            <Text style={styles.dialogTitle}>{dialog.title}</Text>
            <Text style={styles.dialogBody}>{dialog.body}</Text>
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <TouchableOpacity onPress={() => setDialog(undefined)} style={styles.dialogNoButton}>
                <Text style={styles.dialogNoButtonText}>{dialog.noButton}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={dialog.action} style={styles.dialogYesButton}>
                <Text style={styles.dialogYesButtonText}>{dialog.yesButton}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 20
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#414141',
    height: 50,
    width: WIDTH - 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10
  },
  menuIcon: {
    marginHorizontal: 20
  },
  searchInput: {
    color: '#ddd',
    fontSize: 16,
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0
  },
  noteTile: {
    marginVertical: 5,
    marginRight: 5,
    borderWidth: 2,
    width: (WIDTH - 40 - 10) / 2,
    borderRadius: 20,
    borderColor: '#999',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  noteTileTitle: {
    color: '#ddd',
    fontWeight: 'bold'
  },
  noteTileBody: {
    color: '#bbb'
  },
  floatingButton: {
    zIndex: 2,
    height: 65,
    width: 65,
    position: 'absolute',
    bottom: 20,
    right: 30,
    backgroundColor: '#4C8EDB',
    borderRadius: 20
  },
  floatingButtonIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  emptyNotesText: {
    color: '#ddd',
    fontSize: 18,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  newNoteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: HEIGHT,
    width: WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#000000bb'
  },
  newNoteView: {
    backgroundColor: '#212121',
    flex: 1,
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20
  },
  noteTitle: {
    color: '#4C8EDB',
    fontSize: 22,
    marginBottom: 10
  },
  noteBody: {
    fontSize: 18,
    color: '#ccc',
    flex: 1,
    textAlignVertical: 'top',
  },
  actionBar: {
    zindex: 1,
    height: 50,
    width: WIDTH - 100,
    position: 'absolute',
    bottom: 50,
    left: 30,
    backgroundColor: '#3769a3',
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 40,
    // justifyContent: 'space-around'
  },
  actionBarLastModifiedView: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center'
  },
  actionBarButton: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: '5%'
  },
  dialog: {
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000000bb',
    paddingTop: HEIGHT / 2 - (HEIGHT / 10),
    paddingHorizontal: WIDTH / 2 - (WIDTH / 2.5)
  },
  dialogFg: {
    backgroundColor: '#212121',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30
  },
  dialogTitle: {
    fontSize: 20,
    color: '#4C8EDB',
    marginTop: 10
  },
  dialogBody: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 10
  },
  dialogYesButton: {
    borderWidth: 2,
    borderColor: '#b10000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginLeft: 'auto',
    borderRadius: 10,
    marginBottom: 10
  },
  dialogNoButton: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4C8EDB',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 10
  },
  dialogNoButtonText: {
    color: '#4C8EDB',
    fontSize: 16
  },
  dialogYesButtonText: {
    color: '#B10000',
    fontSize: 16
  }
});

export default Main;
