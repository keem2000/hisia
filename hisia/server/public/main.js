
const checkLogin = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/login';
    }

    const posts = JSON.parse(localStorage.getItem('posts'));
    if (!posts) {
        localStorage.setItem('posts', JSON.stringify([]));
    }

    const users = JSON.parse(localStorage.getItem('users'));
    if (!users) {
        localStorage.setItem('users', JSON.stringify([]));
    }

}

const createPost = async () => {
    const content = document.getElementById('post').value;

    if (!content) {
        alert('Please enter post content');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    const data = await fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    }).then(res => res.json()).catch(err => console.log(err));


    const post = {
        id: new Date().getUTCMilliseconds(),
        username: user.email.split('@')[0],
        likes: [
        ],
        content: content,
        score: data.score ?? 0,
    }

    const posts = JSON.parse(localStorage.getItem('posts'));

    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    const postsElement = document.getElementById('posts');
    postsElement.innerHTML = '';

    loadPosts();
}

const likePost = (e, id) => {
    e.preventDefault();

    const posts = JSON.parse(localStorage.getItem('posts'));
    const post = posts.find(post => post.id === id);



    const user = JSON.parse(localStorage.getItem('user'));

    const like = {
        name: user.email.split('@')[0],
        likedAt: Date.now()
    }

    const checkLike = post.likes.find(like => like.name === user.email.split('@')[0]);
    if (checkLike) {
        post.likes = post.likes.filter(like => like.name !== user.email.split('@')[0]);
        localStorage.setItem('posts', JSON.stringify(posts));

        const postsElement = document.getElementById('posts');
        postsElement.innerHTML = '';

        loadPosts();
        return;
    }
    post.likes.push(like);

    localStorage.setItem('posts', JSON.stringify(posts));

    const postsElement = document.getElementById('posts');
    postsElement.innerHTML = '';

    loadPosts();
}




const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const postsElement = document.getElementById('posts');

    const template = new Template();

    console.log(posts);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!posts) return;
    posts.forEach(post => {
        postsElement.innerHTML += template.postCard(post, user);
    });

}

document.addEventListener('DOMContentLoaded', function () {
    checkLogin();

    const user = JSON.parse(localStorage.getItem('user'));
    const userElement = document.getElementById('username');

    userElement.innerHTML = user.email.split('@')[0];

    loadPosts();

    const form = document.getElementById('post-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        createPost();
    });

    const logout = document.getElementById('logout-btn');
    logout.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = '/login';
    });
});



class Template {

    postCard(post, user) {
        const liked = post.likes.find(like => like.name === user.email.split('@')[0]);

        return `
        <div class="w-full px-2 py-3 lg:py-6  rounded-md shadow-lg space-y-2 lg:space-y-4">
                <div class="w-full flex justify-start items-center gap-x-2">
                    <div class="w-12 h-12 rounded-full bg-gray-500"></div>
                    <p class="text-black dark:text-white">
                        ${post.username}
                    </p>
                </div>
                <div class="w-full pl-14" id="post-content">
                    <p class="text-black dark:text-white">
                        ${post.content}
                    </p>
                </div>
                <div class="w-full pl-14 flex justify-between">
                    <ion-icon name="heart-outline"
                        class="text-lg ${liked ? 'text-teal-500 hover:text-teal-100 '
                :
                'text-black dark:text-white  hover:text-teal-500'}" 
                onclick="likePost(event, ${post.id})"
                       >
                    </ion-icon>
                    <ion-icon 
                        id=${post.id}-icon
                        name="warning-outline"
                        class="${post.score * 100 < 15 ? 'text-orange-300' : 'text-red-500'} text-lg hover:text-teal-500"></ion-icon>
                   
                </div>
                ${liked && post.likes.length > 2 ? `
                <p class="text-black dark:text-white text-sm">
                    Liked by <span class="font-bold">${post.likes[0].name}</span> 
                    and 
                    <span class="font-bold">${post.likes.length - 1}</span> others
                </p>` : ''}

            </div>
        `;
    }
}