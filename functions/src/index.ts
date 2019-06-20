import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

interface Post {
    readonly title: string;
    readonly date: string;
    readonly due: string;
    readonly status: string;
    readonly markdownText: string;
    readonly htmlText: string;
    listId: string;
    postId: string;
}

interface PostSummaryI {
    title: string;
    date: string;
    due: string;
    status: string;
    listId: string;
    postId: string;
}

export const onUsersPostCreate = functions.firestore.document('/user_post/{userId}/post_list/{listId}/post/{postId}').onCreate(async (snapshot, context) => {
    await copyPostToAllPosts(snapshot, context);
});

export const onUsersPostUpdate = functions.firestore.document('/user_post/{userId}/post_list/{listId}/post/{postId}').onUpdate(async (change, context) => {
    await copyPostToAllPosts(change.after, context);
});

export const onUsersPostDelete = functions.firestore.document('/user_post/{userId}/post_list/{listId}/post/{postId}').onDelete(async (snapshot, context) => {
    await deletePostFromAllPosts(snapshot, context);
});



async function copyPostToAllPosts(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
    const post = snapshot.data() as Post;
    const postSummary: PostSummaryI = post;
    postSummary.listId = context.params.listId;
    postSummary.postId = snapshot.id;
    await firestore.collection('user_all_posts').doc("name").collection("all_posts").doc(postSummary.postId).set(postSummary, { merge: true });
}


async function deletePostFromAllPosts(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
    const post = snapshot.data() as Post;
    const postSummary: PostSummaryI = post;
    postSummary.postId = snapshot.id;
    await firestore.collection('user_all_posts').doc("name").collection("all_posts").doc(postSummary.postId).delete();
}