import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { Searchbar } from "../searchbar/Searchbar";
import { ImageGallery } from "../imageGallery/ImageGallery";
import { ImageGalleryItem } from "../imageGalleryItem/ImageGalleryItem";
import { Button } from "../button/Button";
import { Modal } from "../modal/Modal";
import { Wrapper } from "../wrapper/Wrapper";

export class App extends Component {
  
  state = {
    url: 'pixabay.com/api/',
    key: '22593683-900dbddd4b86d221bedd65f3e',
    page: 1,
    searchInput: '',
    status: 'idle',
    isModalOpen: false,
    imageData: '',
    images: [],
    newImages: [],
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.searchInput !== this.state.searchInput) {
      this.setState({ status: 'pending' })
        this.fetchImages();
      this.toBottom();
       this.setState({ page: 1 })
    } //else if (prevState.page !== this.state.page) {
    //   this.fetchImages();
    // }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onHandleKeydown)
  }

  componentWillUnmount() {
    window.removeEventListener ('keydown', this.onHandleKeydown)
  }

  onHandleKeydown = (e) => {
    if (e.code === 'Escape' ) {
      this.onTogleMoodal();
    }
  }

  async fetchImages() {
    const { url, page, key, searchInput } = this.state;
    await fetch(`https://${url}?q=${searchInput}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=12`)
     .then(response => {return response.json();
     }).then(data => {
       if (data.hits.length === 0) { this.setState({ status: 'rejected' }) }
       else {
         this.setState(prevState => ({
           newImages: data, status: 'resolved', images: [...prevState.images, ...this.state.newImages]
         })) 
       } console.log(this.state.images);
     }).catch(error => this.setState({ status: 'rejected' }))
    this.setStatus();
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

  onHandleSubmit = (inputValue) => {
    this.setState({ searchInput: inputValue });
  }


  onImageClick = (data) => {
    this.setState({ imageData: data });
    this.onTogleMoodal();
  }

  onTogleMoodal = (e) => {
    this.setState(({isModalOpen}) => ({ isModalOpen: !isModalOpen }));
  }

  onLoadNext = () => {
    // this.setState(({page}) => ({
    // //   page: page + 1,
    // // }));
    
    this.toTop();
  }

  render() {
    const {status, images, isModalOpen, imageData} = this.state;
    return (
      <Wrapper>
        <Searchbar onSubmit={this.onHandleSubmit} />
        {status === 'resolved' &&
          <ImageGallery>
          <ImageGalleryItem
            response={images}
            onSelect={this.onImageClick} />
          </ImageGallery>}
        {status === 'resolved' && <Button onHandleSubmit={this.onLoadNext}/>}
        { isModalOpen &&
          <Modal imageURL={imageData} onClose={this.onTogleMoodal} />}
        {status === 'pending' && <Loader
          type="Puff"
          color="#3f51b5"
          height={100}
          width={100}
          timeout={3000}
        />}
      <ToastContainer theme="colored" autoClose='2000'/>
      </Wrapper>
    );
  }
}
