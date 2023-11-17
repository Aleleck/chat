import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  currentIndex = 0;

  carouselItems = [
    { image: '../../../assets/cesde.jpg', alt: 'Imagen 1' },
    { image: 'imagen2.jpg', alt: 'Imagen 2' },
    { image: 'imagen3.jpg', alt: 'Imagen 3' },
    // Agrega más imágenes según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
    this.showSlide(this.currentIndex);
  }

  showSlide(index: number): void {
    const carousel = document.querySelector('.carousel-inner') as HTMLElement;
    const slides = document.querySelectorAll('.carousel-item');

    if (index >= slides.length) {
      this.currentIndex = 0;
    } else if (index < 0) {
      this.currentIndex = slides.length - 1;
    } else {
      this.currentIndex = index;
    }

    const translateValue = -this.currentIndex * 100 + '%';
    if (carousel) {
      carousel.style.transform = 'translateX(' + translateValue + ')';
    }
  }

  prevSlide(): void {
    this.showSlide(this.currentIndex - 1);
  }

  nextSlide(): void {
    this.showSlide(this.currentIndex + 1);
  }
}
