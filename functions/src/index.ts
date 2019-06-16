import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

interface Post {
    readonly title: string;
    readonly date: string;
    readonly due: string;
    readonly status: string;
}

interface PostSummaryI {
    title: string;
    date: string;
    due: string;
    status: string;
    listId: string;
    postId: string;
}

class PostSummary implements PostSummaryI {
    title: string;
    date: string;
    due: string;
    status: string;
    listId: string;
    postId: string;
    constructor(title: string, date: string, due: string, status: string, listId: string, postId: string) {
        this.title = title;
        this.date = date;
        this.due = due;
        this.status = status;
        this.listId = listId;
        this.postId = postId;
    }
}

export const onUsersPostCreate = functions.firestore.document('/user_post/{userId}/post_list/{listId}/post/{postId}').onCreate(async (snapshot, context) => {
    await copyToRootWithUsersPostSnapshot(snapshot, context);
});

export const onUsersPostUpdate = functions.firestore.document('/user_post/{userId}/post_list/{listId}/post/{postId}').onUpdate(async (change, context) => {
    await copyToRootWithUsersPostSnapshot(change.after, context);
});

async function copyToRootWithUsersPostSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
    const post = snapshot.data() as Post;
    let postSummary = new PostSummary(post.title, post.date, post.due, post.status, context.params.listId, snapshot.id);
    await firestore.collection('user_all_posts').doc("name").collection("all_posts").doc(postSummary.postId).set(postSummary, { merge: true });
}