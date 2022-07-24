
import { render } from "solid-js/web";
import { createSignal, createEffect, For, createMemo, Show } from "solid-js";
import { createStore } from "solid-js/store"
Function(await fetch("https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.js").then(r => r.text()))()

type MusicApp = { files: File[], songId: number }
const [musicApp, setMusicApp] = createStore<MusicApp>({
  files: [],
  songId: 0
})
const updateMusicApp = {
  addFile(file: File) {
    setMusicApp("files", musicApp.files.concat(file))
  },
  playNextSong() {
    const nextSongId = musicApp.songId + 1
    if (nextSongId > musicApp.files.length - 1) return
    setMusicApp("songId", nextSongId)
  },
  playPrevSong() {
    const prevSongId = musicApp.songId - 1
    if(prevSongId < 0) return
    setMusicApp("songId", prevSongId)
  },
  playClickedSong(clickedSong: number) {
    setMusicApp("songId", clickedSong)
  }
}
const currentFile = () => musicApp.files[musicApp.songId]
const allSongs = useMusicInfo(() => musicApp.files)
const currentSong = () => allSongs()[musicApp.songId]

render(MyApp, app)

function MyApp() {
  onDroppedFile(updateMusicApp.addFile)

  return (
    <center>
      <Show when={musicApp.files.length}>
        <Show when={allSongs().length}>
          <DisplayImage file={currentFile()} src={currentSong().img}/>
          <p>{currentSong().tags.album} - {currentSong().tags.artist}</p>
          <p>#{currentSong().tags.track} | {currentSong().tags.genre}, {currentSong().tags.year}</p>
        </Show>
        <PlayAudio url={fileToSrc(currentFile())}/>
      </Show>
      <br/>
      <button onClick={updateMusicApp.playPrevSong}>Prev song</button>
      <button onClick={updateMusicApp.playNextSong}>Next song</button>
      <aside>
        <For each={allSongs()}>
          {(info, id) => <p style="margin: auto; text-align: left; max-width: 500px;" onClick={() => updateMusicApp.playClickedSong(id())}>{info.tags.artist} - {info.tags.title}</p>}
        </For>
      </aside>
    </center>
  )
}

function DisplayImage(props: {src:string, file:File}) {
  return (
    <div>
      <img style="width:300px; height:300px" src={props.src}/>
      <h2>{props.file.name}</h2>
    </div>
  )
}

function PlayAudio(props: {url: string}) {
  return (
    <audio autoplay controls src={props.url}/>
  )
}


function fileToSrc(file: File) {
  return URL.createObjectURL(file)
}

function onDroppedFile(callback: (f:File) => any, el = document) {
  el.ondragover = dragevent
  el.ondrop = dragevent
  function dragevent(ev) {
    ev.preventDefault()

    if(!ev.dataTransfer.files.length) return

    callback(ev.dataTransfer.files[0])
  }
}

type MusicInfo = {
    size: 95607,
    tags: {
        title: string,
        artist: string,
        album: string,
        comment: {
            short_description: string,
            text: string
        },
        track: string,
        genre: string,
        year: string,
        picture: { data: number[] }
    }
}
function useMusicInfo(files: () => File[] | Readonly<File[]>) {
  const [infos, setInfos] = createSignal<MusicInfo[]>([])
  createEffect(async () => {
    if(!files().length) return
    const readFiles = []
    for (const file of files()) {
      let onSuccess
      let promise = new Promise(r => onSuccess = r)
      jsmediatags.read(file, { onSuccess })
      readFiles.push(promise)
    }
    const realInfos = (await Promise.all(readFiles))
    for (const info of realInfos) {
      info.img = arrayAsSrc(info.tags.picture.data)
    }
    setInfos(realInfos)
  })
  return infos
  function arrayAsSrc(array) {
    return (URL.createObjectURL(new Blob([new Uint8Array(array)])))
  }
}
