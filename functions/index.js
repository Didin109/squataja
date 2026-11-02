const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
admin.initializeApp();
const EMAILJS_PRIVATE_KEY = defineSecret('EMAILJS_PRIVATE_KEY');
// Isi ID ini dengan Service ID, Template ID, dan Public Key EmailJS milikmu.
const SERVICE_ID = 'GANTI_SERVICE_ID';
const TEMPLATE_ID = 'GANTI_TEMPLATE_ID';
const PUBLIC_KEY = 'GANTI_PUBLIC_KEY';
exports.notifyPostReply = onDocumentCreated({document:'posts/{postId}/replies/{replyId}',secrets:[EMAILJS_PRIVATE_KEY]}, async event => {
 const reply=event.data.data(); const postId=event.params.postId;
 const postSnap=await admin.firestore().doc(`posts/${postId}`).get(); if(!postSnap.exists)return;
 const post=postSnap.data(); if(reply.authorUid===post.ownerUid)return;
 const userSnap=await admin.firestore().doc(`users/${post.ownerUid}`).get(); if(!userSnap.exists)return;
 const recipient=userSnap.data().email; if(!recipient)return;
 const body={service_id:SERVICE_ID,template_id:TEMPLATE_ID,user_id:PUBLIC_KEY,accessToken:EMAILJS_PRIVATE_KEY.value(),template_params:{to_email:recipient,owner_name:post.nickname,reply_name:reply.nickname,reply_text:reply.text,post_title:`${post.forumType === 'member' ? 'Cari Member' : 'Cari Squad'} ${post.squadFullName || post.tag}`,post_id:postId}};
 const response=await fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(!response.ok)throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
});