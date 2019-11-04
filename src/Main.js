import React, { useState, useEffect }  from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

import 'filepond/dist/filepond.min.css';

function Main() {

    let pond;
    const [ fileState, setFileState ] = useState('123');
    console.log(fileState);
    useEffect(() => {
        console.log('effect',fileState);
    });

    const handleInit = () => {
        console.log('FilePond instance has initialised', pond);
    };

    const change = e => {
        setFileState(e.target.value);
    }
    return (
        <div className="App">
            {/* Pass FilePond properties as attributes */}
            <FilePond ref={ref => pond = ref}
                    files={fileState.files}
                    allowMultiple={true}
                    maxFiles={3} 
                    // server="/api"
                    oninit={() => handleInit() }
                    onupdatefiles={fileItems => {
                        // Set currently active file objects to this.state
                        setFileState({
                            files: fileItems.map(fileItem => fileItem.file)
                        });
                    }}>
            </FilePond>
            
        </div>
    );
    // return (<div><input value={fileState} onChange={change}/></div>);
}

export default Main;
