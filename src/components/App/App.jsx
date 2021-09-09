import React, { Component } from 'react';
import { Searchbar } from "../Searchbar/Searchbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
// import { ImageGallery } from "../ImageGallery/ImageGallery";
// import { Filter } from "../Filter/Filter";
// import { ContactList } from "../ContactList/ContactList";

export class App extends Component {
  
  state = {
    url: 'https://pixabay.com/api/',
    page: 1,
    key: '22593683-900dbddd4b86d221bedd65f3e',
   searchInput: '',
  }

  onHandleSubmit = (inputValue) => {
    this.setState({ searchInput: inputValue });
    const { url, page, key, searchInput } = this.state;
    const response = axios.get(`${url}q=${searchInput}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=12`)
    return response.data;
  }

  render() {
    
    return (
      <>
      <Searchbar onSubmit={this.onHandleSubmit} />
      <ToastContainer theme="colored"/>
      </>
    );
  }
}
