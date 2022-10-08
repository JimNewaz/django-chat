const APP_ID = '9064305b9aa644d2a8f3e3e8b5fabfab'
const CHANNEL = 'main'
const TOKEN = '0069064305b9aa644d2a8f3e3e8b5fabfabIAAe4KNq7rVwGssO+qZSm3WKLm3QZ2hfPEU+Aho2TheAIGTNKL8AAAAAEAC5bVGz1BirYgEAAQDTGKti'


// console.log("Sterm.js is connected")

const client = AgoraRTC.createClient({mode:'rtc' , codec:'vp8'})

let localTracks = []
let remoteUsers = {}


let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserleft)

    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = 
                `<div  class="video-container" id="user-container-${UID}">
                    <div class="video-player" id="user-${UID}">
                    </div>
                        
                </div>`
                document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

                localTracks[1].play(`user-${UID}`)
                

                // Publish Method
                await client.publish([localTracks[0], localTracks[1]])
}


let handleUserJoined = async (user,mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    // console.log(mediaType)
    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)

        if(player != null){
            player.remove()
        }
        
        player = 
                `<div  class="video-container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}">
                    </div>
                        
                </div>`
                document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
                user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack().play()
    }
}


let handleUserleft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}
joinAndDisplayLocalStream()