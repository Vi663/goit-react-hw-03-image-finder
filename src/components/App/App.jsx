import React, { Component } from 'react';
import { Searchbar } from "../searchbar/Searchbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { ImageGallery } from "../imageGallery/ImageGallery";
import { ImageGalleryItem } from "../imageGalleryItem/ImageGalleryItem";
import { Button } from "../button/Button";
// import { ContactList } from "../ContactList/ContactList";

export class App extends Component {
  
  state = {
    url: 'pixabay.com/api/',
    key: '22593683-900dbddd4b86d221bedd65f3e',
    page: 1,
    searchInput: '',
    apiResponse: null,
    status: 'idle',
    isModalOpen: false,
  }

  async fetchImages() {
    const { url, page, key, searchInput } = this.state;
      await fetch(`https://${url}?q=${searchInput}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=12`)
     .then(response => {return response.json();
     }).then(data => {
       console.log(data)
       if (data.total === 0) { this.setState({ status: 'rejected' }) }
       else { this.setState({ apiResponse: data, status: 'resolved' }) };
     }).catch(error => this.setState({ status: 'rejected' }))
    //   const response = await axios.get(`https://${url}?q=${searchInput}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=12`);
    // this.setState({ apiResponse: response, status: 'resolved' });
    // this.setStatus();
  };

  toTop = () => {
    window.scrollBy({
      top: -window.pageYOffset,
      behavior: 'smooth',
    });
  }

  toBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  setStatus = () => {
    if (this.state.status === 'pending') {
      toast.loading("Loading")
    } else if (this.state.status === 'resolved') {
      toast.success("found!")
    } else if (this.state.status === 'rejected') {
      toast.error("Not found!")
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.searchInput !== this.state.searchInput) {
      this.setState({ status: 'pending' })
      this.fetchImages();
      this.toBottom();
      // this.setStatus();
    }
  };

  onHandleSubmit = (inputValue) => {
    this.setState({ searchInput: inputValue });
  }


  onImageClick = (e) => {
    // e.preventDefault();
    // this.setState(prevState => ({
    //   page: prevState.page + 1,
    // }));
    // this.fetchImages();
    // this.toBottom();
  }

  onLoadNext = () => {

    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
    this.fetchImages();
    this.toBottom();
  }

  render() {
    const {status, apiResponse} = this.state
    return (
      <>
        <Searchbar onSubmit={this.onHandleSubmit} />
          {status === 'resolved' &&
          <ImageGallery>
            <ImageGalleryItem
              response={apiResponse.hits}
            onSelect={this.onImageClick} />
          <Button onhandleSubmit={this.onLoadNext}/>
          </ImageGallery>
          }
      <ToastContainer theme="colored"/>
      </>
    );
  }
}
