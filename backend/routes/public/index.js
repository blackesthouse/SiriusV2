setInterval(async() => {
    if (window.location.pathname === '/dash') {
        const res = await (await fetch('/api/client/isLeader')).json();
        if (res.isLeader) document.getElementById('hide_button').hidden = false;
        else document.getElementById('hide_button').hidden = true;
    }
}, 1000);

async function login() {
    document.getElementById('error_message').innerHTML = '';

    const code = document.getElementById('authorization_code').value;
    const errorMessage = document.getElementById('error_message');

    if (!code) return errorMessage.innerHTML = 'Please provide an authorization code.';
    if (code.length !== 32) return errorMessage.innerHTML = 'Authorization codes are 32 characters long.';

    try {
        console.log('[debug]', 'Signing in...');

        const bot = await (await fetch(`/api/client/login?code=${code}`)).json();
        if (bot.status !== 200) return errorMessage.innerHTML = bot.message;

        localStorage.setItem('deviceAuth', bot.deviceAuth);
        localStorage.setItem('displayName', bot.displayName);

        console.log('[debug]', 'Signed in. Redirecting..');
        window.location.href = '/dash';
    } catch (err) {
        errorMessage.innerHTML = 'Invalid authorization code supplied.';
    }
}

async function logout() {
    await fetch('/api/client/logout');
    window.location.href = '/get-started';
}

async function hideMembers() {
    const hideButton = document.getElementById('hide_button');

    if (hideButton.innerHTML === 'HIDE') {
        await fetch('/api/party/hideMembers?value=true');
        hideButton.innerHTML = 'UNHIDE';
    } else {
        await fetch('/api/party/hideMembers?value=false');
        hideButton.innerHTML = 'HIDE';
    }
}

async function changeLevel() {
    const errorMessage = document.getElementById('error_message');

    errorMessage.innerHTML = '';

    const level = document.getElementById('level');
    if (!level.value || !parseInt(level.value)) return errorMessage.innerHTML = 'Please provide a valid level.';

    await fetch(`/api/client/changeLevel?level=${level.value}`);
    document.getElementById('level').innerHTML = '';
}

async function searchCosmetic(cosmeticType) {
    const errorMessage = document.getElementById('error_message');

    let cosmeticName;

    switch (cosmeticType) {
        case 'outfit': cosmeticName = document.getElementById('outfit').value; type = 'outfit'; break;
        case 'backpack': cosmeticName = document.getElementById('backpack').value; type = 'backpack'; break;
        case 'emote': cosmeticName = document.getElementById('emote').value; type = 'emote'; break;
        case 'pickaxe': cosmeticName = document.getElementById('pickaxe').value; type = 'pickaxe'; break;
        case 'level': cosmeticName = document.getElementById('level').value; type = 'level'; break;
    }

    if (!cosmeticName) return errorMessage.innerHTML = 'Please provide at least one parameter.';

    const cosmetics = await (await fetch(`/api/client/cosmetics?query=${cosmeticName}&type=${cosmeticType}`)).json();

    if (!cosmetics.data[0]) errorMessage.innerHTML = 'No cosmetics found.';
    else {
        try {
            window.location.href = '#popup';

            const buttons = [];
            let i = 0;

            cosmetics.data.forEach(c => {
                i++;
                
                const image = c.images.icon;
                const content = document.getElementById('cosmetic_content');

                content.innerHTML += `<div id="cosmetic_${c.id}" class="cosmetic" style="display: inline-block;"> <img id="cosmetic_image_${c.id}" width='125' height='125' src="${image}"/><h1 style="color: #fff; top: 30px; font-size: 10px;">${c.name.toUpperCase()}</h1><h1></h1>`;

                buttons.push({
                    value: `cosmetic_image_${c.id}`,
                    c
                });

                if (i === cosmetics.data.length) {
                    chooseCosmetic();
                }
            });

            function chooseCosmetic() {
                buttons.forEach(b => {
                    const cosmeticImageButton = document.getElementById(b.value);

                    cosmeticImageButton.onclick = () => {
                        if (b.c.variants) {
                            const options = b.c.variants[0].options;

                            document.getElementById('cosmetic_content').innerHTML = '';
                            document.getElementById('variants_content_h1').innerHTML = `${b.c.name} Variants`;

                            const buttons = [];
                            let i = 0;

                            options.forEach(option => {
                                i++;

                                document.getElementById('variants_content').innerHTML += `<div id="variant_${option.tag}" class="cosmetic_variant" style="display: inline-block;"> <img width='125' height='125' src='${option.image}'/><h1 style="color: #fff; top: 30px; font-size: 10px;">${option.name}</h1><h1></h1>`;

                                buttons.push({
                                    value: `variant_${option.tag}`,
                                    option
                                });

                                if (i === options.length) {
                                    chooseVariant(option);
                                }
                            });

                            function chooseVariant(option) {
                                buttons.forEach(button => {
                                    const doc = document.getElementById(button.value);

                                    doc.onclick = () => changeVariant(b, { tag: button.option.tag });
                                });
                            }
                            
                            window.location.href = '#cosmetic_variants_popup';
                            return;
                        }

                        fetch(`/api/client/changeCosmetic?value=${b.c.id}&type=${b.c.type.value}`);
                        window.location.href = '#';

                        document.getElementById('cosmetic_content').innerHTML = '';
                        document.getElementById('outfit').value = '';
                        document.getElementById('backpack').value = '';
                        document.getElementById('emote').value = '';
                        document.getElementById('pickaxe').value = '';
                        document.getElementById('level').value = '';
                    }
                });
            }
        } catch {}
    }
}

async function changeVariant(cosmetic, variantOptions) {
    cosmetic = cosmetic.c;

    const tag = variantOptions.tag;
    const channel = cosmetic.variants[0].channel;

    await fetch(`/api/client/changeCosmeticVariant?cosmeticId=${cosmetic.id}&cosmeticType=${cosmetic.type.value}&tag=${tag}&channel=${channel}`);
    window.location.href = '#';

    document.getElementById('variants_content').innerHTML = '';
    document.getElementById('outfit').value = '';
    document.getElementById('backpack').value = '';
    document.getElementById('emote').value = '';
    document.getElementById('pickaxe').value = '';
    document.getElementById('level').value = '';
}

async function stopEmote() {
    await fetch('/api/client/clearEmote');
}

async function clearBackpack() {
    await fetch('/api/client/clearBackpack');
}

async function showFriends() {
    const friendsElement = document.getElementById('friends');

    friendsElement.innerHTML = '';

    const friends = (await (await fetch('/api/client/user')).json()).data.friends;

    let i = 0;
    const buttons = [];

    friends.forEach(friend => {
        i++;

        friendsElement.innerHTML += `<div id="${friend.id}" class="friend"><button>${friend.displayName}</button></div>`;
        buttons.push({
            id: friend.id,
            displayName: friend.displayName
        });

        if (i === friends.length) {
            chooseFriend();
        }
    });

    function chooseFriend() {
        buttons.forEach(b => {
            const button = document.getElementById(b.id);

            button.onclick = () => manageFriend(b);
        });
    }
    
    window.location.href = '#friends_popup';
}

async function manageFriend(friend) {
    const user = document.getElementById('user');

    user.innerHTML = '';
    document.getElementById('user_displayname').innerHTML = friend.displayName || `UNKNOWN | ${friend.id}`;
    
    window.location.href = '#manage_user_popup';

    const friendInformation = (await (await fetch(`/api/client/friends?id=${friend.id}`)).json()).data;
    const isInParty = (await (await fetch('/api/party/members')).json()).data.some(x => x.id === friend.id);

    let connections = [];

    for (const key in friendInformation.user.connections) {
        connections.push({
            platform: key.toUpperCase(),
            displayName: friendInformation.user.connections[key].name
        });
    }

    if (friendInformation.presence.status !== null) user.innerHTML += `<h1 style="font-size: 20px; color: #fff;">${friendInformation.presence.status}</h1> `;

    user.innerHTML += `<h1 class="userInformation">Account ID: ${friend.id}</h1>`;
    user.innerHTML += `<h1 class="userInformation">Online: ${friendInformation.isOnline ? 'Yes' : 'No'}</h1> `;


    connections.forEach(c => {
        user.innerHTML += `<h1 class="userInformation">${c.platform}: ${c.displayName}</h1> `;
    });

    if (!isInParty && friendInformation.isOnline) user.innerHTML += `<button id="invite">INVITE</button> `;
    if (!isInParty && friendInformation.isJoinable) user.innerHTML += `<button id="join">JOIN</button> <h1></h1>`;

    user.innerHTML += `<button id="remove_friend">REMOVE FRIEND</button>`;

    const inviteButton = document.getElementById('invite');
    const joinButton = document.getElementById('join');
    const removeFriendButton = document.getElementById('remove_friend');

    if (inviteButton) inviteButton.onclick = () => inviteUser(friend);
    if (joinButton) joinButton.onclick = () => joinUser(friend);
    if (removeFriendButton) removeFriendButton.onclick = () => addOrRemoveFriend(friend);
}

async function showPartyMembers() {
    const element = document.getElementById('party_members');

    element.innerHTML = '';

    const partyMembers = await (await fetch('/api/party/members')).json();

    const buttons = [];
    let i = 0;

    partyMembers.data.forEach(member => {
        i++;
        
        const skinId = JSON.parse(member.meta.schema['Default:AthenaCosmeticLoadout_j']).AthenaCosmeticLoadout.characterDef.split('/')[6].split('.')[0];
        const skinImage = `https://fortnite-api.com/images/cosmetics/br/${skinId.toLowerCase()}/icon.png`;

        let text = '';

        text += `<div class="user" style="display: inline-block;"><h1 style="color: #fff; top: 30px; font-size: 15px">${member.role === 'CAPTAIN' ? `${member.displayName} 👑` : member.displayName}</h1><img width='100' height='100' src="${skinImage}"/><h1></h1>`;
        text += `<button id="manage_user_${member.id}" style="top: 30px;">MANAGE</button>`;

        buttons.push({
            id: `manage_user_${member.id}`,
            member
        });

        element.innerHTML += text;

        if (partyMembers.data.length === i) {
            chooseUser();
        }
    });

    window.location.href = '#party_members_popup';

    function chooseUser() {
        buttons.forEach(b => {
            const button = document.getElementById(b.id);

            button.onclick = () => manageUser(b.member);
        });
    }
}

async function manageUser(partyMember) {
    document.getElementById('user').innerHTML = '';
    document.getElementById('user_displayname').innerHTML = partyMember.displayName || `UNKNOWN | ${partyMember.id}`;

    window.location.href = '#manage_user_popup';

    const isLeader = (await (await fetch('/api/client/isLeader')).json()).isLeader;
    const isMe = partyMember.id !== (await (await fetch('/api/client/user')).json()).data.user.id ? false : true;

    const user = document.getElementById('user');
    const meta = JSON.parse(partyMember.meta.schema['Default:AthenaCosmeticLoadout_j']).AthenaCosmeticLoadout;
    
    const skinId = meta.characterDef.split('/')[6].split('.')[0];
    
    let backpackId;

    try {
        backpackId = meta.backpackDef.split('/')[6].split('.')[0]
    } catch {
        backpackId = 'null';
    }

    const pickaxeId = meta.pickaxeDef.split('/')[6].split('.')[0];
    
    const cosmetics = await (await fetch('/api/client/cosmetics')).json();
    const skin = cosmetics.data.find(x => x.id.toLowerCase() === skinId.toLowerCase());
    const backpack = cosmetics.data.find(x => x.id.toLowerCase() === backpackId.toLowerCase());
    const pickaxe = cosmetics.data.find(x => x.id.toLowerCase() === pickaxeId.toLowerCase());

    const skinUrl = skin.images.icon;

    user.innerHTML += `<img height='150' width='150' src="${skinUrl}"/> <h1> </h1>`
    user.innerHTML += `<h1 style="color: #fff; font-size: 15px">Skin: ${skin.name}</h1>`;
    user.innerHTML += `<h1 style="color: #fff; font-size: 15px">Backpack: ${backpackId !== 'null' ? backpack.name : 'None'}</h1>`;
    user.innerHTML += `<h1 style="color: #fff; font-size: 15px">Pickaxe: ${pickaxe.name}</h1>`;
    user.innerHTML += `<h1 style="color: #fff; font-size: 15px">Account ID: ${partyMember.id}</h1>`;
    user.innerHTML += `<h1 style="color: #fff; font-size: 15px">Party Leader: ${partyMember.role === 'CAPTAIN' ? 'Yes' : 'No'}</h1>`;

    if (isLeader && !isMe) {
        user.innerHTML += `<button id="promote_button">PROMOTE</button> `;
        user.innerHTML += `<button id="kick_button">KICK</button> `;
        user.innerHTML += `<button id="copy_button">COPY</button`;

        const isFriend = (await (await fetch(`/api/client/friends?id=${partyMember.id}`)).json()).isFriend;
        user.innerHTML += `<h1></h1> <button id="add_or_remove_friend">${isFriend ? 'REMOVE' : 'ADD'} FRIEND</button>`;

        document.getElementById('promote_button').onclick = () => promoteUser(partyMember);
        document.getElementById('kick_button').onclick = () => kickUser(partyMember);
        document.getElementById('add_or_remove_friend').onclick = () => addOrRemoveFriend(partyMember);
        document.getElementById('copy_button').onclick = () => copyUser(skin, backpack, pickaxe);
    }
}

async function copyUser(skin, backpack, pickaxe) {
    const skinId = skin.id;
    const backpackId = backpack.id || null;
    const pickaxeId = pickaxe.id;

    await fetch(`/api/client/copyUser?cid=${skinId}&bid=${backpackId}&pickaxeId=${pickaxeId}`);
}

async function promoteUser(user) {
    await fetch(`/api/party/promote?userId=${user.id}`);
}

async function kickUser(user) {
    await fetch(`/api/party/kick?userId=${user.id}`);
}

async function joinUser(user) {
    await fetch(`/api/party/join?userId=${user.id}`);
}

async function inviteUser(user) {
    await fetch(`/api/party/invite?userId=${user.id}`);
}

async function addOrRemoveFriend(user) {
    const isFriend = (await (await fetch(`/api/client/friends?id=${user.id}`)).json()).status === 200;

    if (isFriend) await fetch(`/api/client/friend?id=${user.id}&action=remove`);
    else await fetch(`/api/client/friend?id=${user.id}&action=add`);
}

async function sendPartyChatMessage() {
    const message = document.getElementById('message');
    await fetch(`/api/party/sendMessage?message=${message}`);

    message.value = '';
}