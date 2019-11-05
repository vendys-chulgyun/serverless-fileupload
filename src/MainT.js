import React, { Component }  from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import * as aws from './aws';
import config from './config';


import PhotoCardList from './PhotoCardList';

const useStyles = makeStyles(theme => ({
    fileupload: {
        position: 'fix'
    },
}));

class MainT extends Component {

    constructor(props) {
        super(props);
 
        // aws.init();

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            files: [
            //     {
            //     source: 'index.html',
            //     options: {
            //         type: 'local'
            //     }
            // }
            ],
            photos: [],
        };
        console.log(this.state);
    }
    componentWillMount() {
        console.log('### will mount', this.state);
        this.viewAlbum();
    }

    componentDidMount() {
        console.log('### did mount', this.state);
    }

    componentWillUpdate() {
        console.log('### will update', this.state);
    }

    viewAlbum() {
        aws.viewAlbum((data) => {
            console.log('### list callback', data);
            this.setState({photos: data});
            console.log(this.state);
        });
    }

    handleInit = () => {
        console.log('FilePond instance has initialised', this.pond);
        this.pond._pond.setOptions({
            server: {
                process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {

                    // fieldName is the name of the input field
                    // file is the actual file object to send
                    // const formData = new FormData();
                    // formData.append(fieldName, file, file.name);
        
                    // const request = new XMLHttpRequest();
                    // request.open('POST', 'url-to-api');
        
                    // // Should call the progress method to update the progress to 100% before calling load
                    // // Setting computable to false switches the loading indicator to infinite mode
                    // request.upload.onprogress = (e) => {
                    //     progress(e.lengthComputable, e.loaded, e.total);
                    // };
        
                    // // Should call the load method when done and pass the returned server file id
                    // // this server file id is then used later on when reverting or restoring a file
                    // // so your server knows which file to return without exposing that info to the client
                    // request.onload = function() {
                    //     if (request.status >= 200 && request.status < 300) {
                    //         // the load method accepts either a string (id) or an object
                    //         load(request.responseText);
                    //     }
                    //     else {
                    //         // Can call the error method if something is wrong, should exit after
                    //         error('oh no');
                    //     }
                    // };
        
                    // request.send(formData);
////////////////
console.log('### file process start');
                    const request = aws.addPhoto(file);
// console.log(request);
                    request.on('httpUploadProgress', function (progress) {
                        console.log(progress.loaded + " of " + progress.total + " bytes");
                        
                    });
                    // console.log(request.upload);
                    request.progress = (e) => {
                        console.log('#### onprogress');
                        progress(e.lengthComputable, e.loaded, e.total);
                    };
                    request.on('complete',(a, b, c)=>{
                        console.log('### add complete', a,b ,c);
                    })
                    request.send((err, data) => {
                        if (err) {
                            console.log(err);
                            return alert('There was an error uploading your photo: ', err.message);
                        }
                        console.log('Successfully uploaded photo.');
                        this.viewAlbum();
                    });
///////////////////////                    
                    // Should expose an abort method so the request can be cancelled
                    return {
                        abort: () => {
                            // This function is entered if the user has tapped the cancel button
                            request.abort.bind(request);
        
                            // Let FilePond know the request has been cancelled
                            abort();
                        }
                    };
                },
                load: (source, load, error, progress, abort, headers) => {
                    // Should request a file object from the server here
                    // ...
                    console.log('#### Load', source);
                    // aws.s3.listObjects({
                    //     Delimiter: '/'
                    // }, function (err, data) {
                    //     if (err) {
                    //         return alert('There was an error listing your albums: ' + err.message);
                    //     } else {
                    //         console.log('앨범', data.CommonPrefixes)
                    //         const albums = data.CommonPrefixes.map(function (commonPrefix) {
                    //             const prefix = commonPrefix.Prefix;
                    //             return decodeURIComponent(prefix.replace('/', ''));
                    //         });
                    //         load(albums);
                    //     }
                    // });
        
                    // Can call the error method if something is wrong, should exit after
                    error('oh my goodness');
        
                    // Can call the header method to supply FilePond with early response header string
                    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
                    // headers(headersString);
        
                    // Should call the progress method to update the progress to 100% before calling load
                    // (endlessMode, loadedSize, totalSize)
                    progress(true, 0, 1024);
        
                    // Should call the load method with a file object or blob when done
                    // load(file);
        
                    // Should expose an abort method so the request can be cancelled
                    return {
                        abort: () => {
                            // User tapped cancel, abort our ongoing actions here
        
                            // Let FilePond know the request has been cancelled
                            abort();
                        }
                    };
                },
                // restore: (uniqueFileId, load, error, progress, abort, headers) => {
                //     // Should get the temporary file object from the server
                //     // ...
                //     console.log('#### restore');
                //     // Can call the error method if something is wrong, should exit after
                //     error('oh my goodness');
        
                //     // Can call the header method to supply FilePond with early response header string
                //     // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
                //     // headers(headersString);
        
                //     // Should call the progress method to update the progress to 100% before calling load
                //     // (computable, loadedSize, totalSize)
                //     progress(true, 0, 1024);
        
                //     // Should call the load method with a file object when done
                //     // load(serverFileObject);
        
                //     // Should expose an abort method so the request can be cancelled
                //     return {
                //         abort: () => {
                //             // User tapped abort, cancel our ongoing actions here
        
                //             // Let FilePond know the request has been cancelled
                //             abort();
                //         }
                //     };
                // }
            }
        })
    }

    deletePhoto = async (id) => {
        await aws.deletePhoto(id);
        console.log('### delete compl');
        this.viewAlbum();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="App">
                {/* Pass FilePond properties as attributes */}
                <FilePond 
                    style="position: fix"
                    ref={ref => this.pond = ref}
                    files={this.state.files}
                    allowMultiple={true}
                    maxFiles={3} 
                    // server="/"
                    oninit={() => this.handleInit() }
                    onupdatefiles={fileItems => {
                        // Set currently active file objects to this.state
                        this.setState({
                            files: fileItems.map(fileItem => fileItem.file)
                        });
                    }}>
                </FilePond>
                    <PhotoCardList photos={this.state.photos} handle={this.deletePhoto}/>
            </div>

        );
    }
}

export default withStyles(useStyles)(MainT);
