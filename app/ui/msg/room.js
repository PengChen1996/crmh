import React, {Component} from 'react'
import { StyleSheet,Text,View,TextInput,Button,Image,FlatList } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AutoTextInput from '../../common/autoTextInput';

export default class HomeTwo extends Component {
  static navigationOptions = ({navigation}) => ({
  	title:navigation.state.params.val,
		tabBarVisible: false
  });
  constructor(props) {
    super(props);
    this.state = {text: '',
	    data:[{key: '一'},
						{key: '二'},
						{key: '三'},
						{key: '四'},
						{key: '五'},
						{key: '六'},
						{key: '七'},
						{key: '八'},
						{key: '九'},
						{key: '十'},
					]};
  }
  
  componentDidMount() {
		ws = new WebSocket("ws://119.23.209.74:8000/");
		ws.onopen = () => {
		  console.log("connected");
		};
		ws.onmessage = (e) => {
		  console.log(e);
		};
		ws.onerror = (e) => {
		  console.log(e.message);
		};
		ws.onclose = (e) => {
		  console.log(e.code, e.reason);
		};
  }
  _sendMessage(msg){
  	ws.send(msg);
  	this.state.data.push("111");
  	console.log(this.data);
  }

  _selectImageFile(){
  	options = {
		  title: 'Select Avatar',
		  customButtons: [
		    {name: 'fb', title: 'Choose Photo from Facebook'},
		  ],
		  storageOptions: {
		    skipBackup: true,
		    path: 'images'
		  }
		};
  	ImagePicker.showImagePicker(options, (response) => {
		  console.log('Response = ', response);
		
		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		  else if (response.customButton) {
		    console.log('User tapped custom button: ', response.customButton);
		  }
		  else {
		    let source = { uri: response.uri };
		
		    // You can also display the image using data:
		    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
				console.log(source);
				this._sendImage(response.uri);
		    this.setState({
		      avatarSource: source
		    });
		  }
		});
  }
  _sendImage(imageuri){
    let formData = new FormData();
    let imgFile = {uri: imageuri,type:'multipart/form-data',name:'image.png'};
    console.log(formData);
    formData.append('imgFile',imgFile);
		//  http://119.23.209.74:8080/upload
    fetch('http://192.168.56.1:8080/upload',{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data',
      },
      body:formData,
    })
    .then((response)=>response.text())
    .then((responseData)=>{
      console.log('responseData',responseData);
    })
    .catch((error)=>{console.error('error',error)});
  }
 
  render() {
	  const {params} = this.props.navigation.state;
    return (
      <View style={styles.container}>
      	<View  style={styles.msgContainer}>
      		<FlatList
					  data={this.state.data}
					  extraData={this.state}
					  renderItem={ ({item}) => 
					  	<View>
					  		<View style={{backgroundColor:"bisque",flexDirection:"row",justifyContent:"flex-start"}}>
					  			<Image source={require('../../res/images/logo.png')} style={styles.msgAvatar}/>
							  	<Text style={{padding:10,marginRight:76}}>我就是--{item.key} {this.state.text}</Text>
							  	<Image source={this.state.avatarSource} style={{width:100,height:100}} />
						  	</View>
						  	<View style={{backgroundColor:"brown",flexDirection:"row",justifyContent:"flex-end"}}>
						  		<Image source={this.state.avatarSource} style={{width:100,height:100}} />
							  	<Text style={{padding:10,marginLeft:76}}>我就是--{params.val} {this.state.text}</Text>
							  	<Image source={require('../../res/images/logo.png')} style={styles.msgAvatar}/>
						  	</View>
					  	</View>
					  }
				  />
      	</View>
      	<View style={styles.msgInputContainer}>
          <AutoTextInput
          	style={{flex:1}}
	          placeholder="Type here to translate!"
	          onChangeText={(text) => this.setState({text})}
	        />
			    <View style={{width:60,height:40,margin:3}}>
			    	<Button
			    		onPress={() => this._sendMessage(this.state.text)}
			    		title="发送"/>
			    </View>
			    <View style={{width:40,height:40,margin:3}}>
			    	<Button
			    		onPress={() => this._selectImageFile()}
			    		title="+"/>
			    </View>
      	</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "space-between",
    backgroundColor:"red"
  },
  msgContainer: {
	  flex:1,
  	backgroundColor:"#eee"
  },
  msgAvatar:{
  	width:28,
  	height:28,
  	borderRadius:28,
  	margin:5
  },
  msgInputContainer: {
  	backgroundColor: "bisque",
//  flex:1,
 		flexDirection: 'row',
 		justifyContent: "space-between",
 		alignItems: 'flex-end',
// 	height:48
  },
})
