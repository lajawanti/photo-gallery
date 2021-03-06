import React, { useState } from 'react'
import useFirestore from '../../hooks/useFirestore.js';
import { motion } from 'framer-motion';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkIcon from '@material-ui/icons/Link';
      
import './ImageDisplay.css';
import { projectFirestore } from '../../firebase/firebase.js';

const ImageDisplay = ({ setSelectedImg }) => {
      const { docs } = useFirestore('images');
      // console.log("DOCS... : ", docs)

      const handleLikes = async (likes,  id ) => {
            likes = ++likes;
            const objectToUpdate = projectFirestore.collection('images').doc(id);
            await  objectToUpdate.update( {likes:likes} ) 
          //await projectFirestore.collection('images').where('name' , '==' ,'Mango').onSnapshot(snap => { console.log(snap.doc)})//.where('name', '==', 'Banana').get().then((snapshot) => console.log(snapshot.doc))
      }

      const handleDelete = async (id ) => {
            const delete_confirm = window.confirm("Sure, You want to delete?")
            if(delete_confirm) {
                  const objectToUpdate = projectFirestore.collection('images').doc(id);
                  await  objectToUpdate.delete({id:id}) 
            }
      }

      const facebook_click = (url, name, width, height) => {
            const u = url      
            const t = name;

            var leftPosition, topPosition;
            //Allow for borders.
            leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
            //Allow for title and status bars.
            topPosition = (window.screen.height / 2) - ((height / 2) + 50);
            const windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
            window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer',windowFeatures);
            return false;
      }

      const twitter_click = (url, name, width, height) => {
            const u = url      
            const t = name;
            var leftPosition, topPosition;
            //Allow for borders.
            leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
            //Allow for title and status bars.
            topPosition = (window.screen.height / 2) - ((height / 2) + 50);
            const windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
            window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(u)+'&text='+encodeURIComponent(t),'sharer',windowFeatures);
            return false;
      }

      const copy_link = (url) => {
            if(navigator.clipboard.writeText(url)) {
                  //setCopy(true)
                  alert('Image url copied to clipboard')
            }
      }

      return (
            <div className = "img-display">
                  {docs.length === 0? (<h2 className = "loading">Loading....</h2> ) : null}
                  {docs && docs.map(doc => (
                        <>
                        <motion.div className="img-wrap" key={doc.id} 
                              layout
                              whileHover={{ opacity: 1 }}
                        >
                              <div className = "delete-image"
                                   onClick = {() => {handleDelete(doc.id)}}>X
                                    <div className = "delete">Delete</div>
                              </div>
                        
                        <motion.img src={doc.url} key={doc.id}  alt="uploaded pic"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 }}
                              onClick={() => setSelectedImg({url: doc.url, name: doc.name})}

                        />
                        <div className = "likes-share">  
                              <div className ="likes-share-first-div">
                                    <FavoriteBorderIcon 
                                          className = "likes-icon"
                                          // style={{ fontSize: 40, cursor:'pointer' }}
                                          tooltip="Add New Widget"
                                          onClick={() => {handleLikes(doc.likes, doc.id)}}     
                                    />
                                    <p className = "p-likes">{doc.likes}</p>
                              </div>

                              <div className = "test">
                                    <ShareIcon className = "likes-icon"
                                          style={{paddingRight :'7px'}}
                                    />
                                    <div className = "social-share-wrap" >
                                          <div className = "share-wrap">
                                                <div className = "share-wrap-inside-div">
                                                      <FacebookIcon className = "share-social-icons" style={{color :'#3b5998' }}
                                                                    onClick={() => facebook_click(doc.url, doc.name, 400, 400)}
                                                      />
                                                </div>
                                                <div className = "share-wrap-inside-div">
                                                      <TwitterIcon className = "share-social-icons" style={{color: '#1da1f2'}}
                                                                   onClick={() => twitter_click(doc.url, doc.name, 400, 400)} 
                                                      />
                                                </div>
                                                <div className = "share-wrap-inside-div">
                                                      <LinkIcon className = "share-social-icons"
                                                                onClick={() => copy_link(doc.url)}
                                                      />
                                                </div>
                                          </div>
                                    </div>
                                    
                              </div>

                        </div>

                        </motion.div>
                      </>
                  ))}

            </div>
      )
}

export default ImageDisplay;
