import { render } from "solid-js/web";
import { For, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";

type Playlist = {
  color: string
  title: string
  songs: Song[]
}

type Song = {
  title: string
}

type Ev<T> = {
  currentTarget: {value:T}
}

const songs = [
  {title:"Song One"},
  {title:"Song Two"},
  {title:"Song Thre"},
  {title:"Song Fpir"},
  {title:"Song Five"}
]

const [store, setStore] = createStore({
  playlists: [{color: "red", title: "All Songs", songs: songs}] as Playlist[],
  count: 0,
  title: "",
  color: "",
  songId: -1,
  isCreatingPlaylist: false,
  songList: songs
})

const updateStore = {
  increment(){
    setStore("count", store.count + 1)
  },
  setTitle(e: Ev<string>){
    setStore("title", e.currentTarget.value)
  },
  setColor(e: Ev<string>){
    setStore("color", e.currentTarget.value)
  },
  addPlaylist(){
    setStore("playlists", store.playlists.length, {songs: [], title: store.title, color: store.color})
  },
  setSongId(songId: number){
    setStore("songId", songId)
  },
  addSongToPlaylist(playlistId: number){
    const length = store.playlists[playlistId].songs.length
    setStore("playlists", playlistId, "songs", length, songs[store.songId])
  },
  showPlaylistCreator() {
    setStore("isCreatingPlaylist", !store.isCreatingPlaylist)
  },
  setSongList(songs: Readonly<Song[]>) {
    setStore("songList", songs)
  }
}

function PlaylistItem(props: {playlist: Playlist}) {
  return (
    <div>
        <p style={`padding: 0 .5em; border-radius: .5em; background-color: ${props.playlist.color}`}>
        {props.playlist.title} - {props.playlist.songs.length}
        <SmallerButton onClick={() => updateStore.setSongList(props.playlist.songs)} text={"View Songs"}/>
        </p>
    </div>
  )
}

function ShowPlaylist() {
  return (
    <div style="background: #111; padding: .5em; border-radius: .5em">
      <h2>Playlists</h2>
      <For each={store.playlists}>
        {playlist => (
          <PlaylistItem playlist={playlist as Playlist}/>
        )}
      </For>
    </div>
  )
}

function AddPlaylist() {
  return (
    <div>
      <button onClick={updateStore.increment}>
        {store.count}
      </button>
      <input placeholder="Playlist Title" onInput={updateStore.setTitle}/>
      <input type="color" onInput={updateStore.setColor}/>
      <p>{store.title}</p>
      <p>{store.color}</p>
      <button onClick={updateStore.addPlaylist}>
        Add Playlist
      </button>
    </div>
  )
}

function SmallerButton(props:{text:string, onClick: Function}){
  return (
    <button style="font-size: .9em; margin: .25em .5em" onClick={props.onClick}>{props.text}</button>
  )
}

function ShowSongs() {
  return (
    <div style="background: #111; padding: .5em; border-radius: .5em">
      <h2 style="margin-top:.25em">Songs</h2>
      <For each={store.songList}>
      {(song, index) => (
        <div>
          {song.title}
          <SmallerButton onClick={() => updateStore.setSongId(index())} text={"Add To Playlist"}/>
          <Show when={store.songId == index()}> 
            <For each={store.playlists}>
              {(playlist, pIndex) => (
                <SmallerButton onClick={() => updateStore.addSongToPlaylist(pIndex())} text={playlist.title}/>
              )} 
            </For>
          </Show>
        </div>
        
      )}
      </For>
    </div>
  )
}

function ShowPlaylistCreatorButton() {
  return (
    <button onClick={updateStore.showPlaylistCreator}>
      <Show when={!store.isCreatingPlaylist} fallback={"Cancel"}>
        New Playlist
      </Show>
    </button>
  )
}

function NavInfo(props: {text:string}) {
  return(
    <span style="padding: .5em;">{props.text}</span>
  )
}

function Counter() {


  return (
    <div>
      <nav style="background: #333; padding: .5em; border-radius: .5em;">
        <ShowPlaylistCreatorButton/> 
        <NavInfo text={`${store.playlists.length} Playlist`}/>
        <NavInfo text={`${songs.length} Songs`}/>
      </nav>
      <br/>

      <Show when={store.isCreatingPlaylist}>
        <AddPlaylist/>
      </Show>

      <ShowPlaylist/>
      <br/>
      <ShowSongs/>
    </div>
  );
}

render(() => <Counter />, document.getElementById("app")!);
