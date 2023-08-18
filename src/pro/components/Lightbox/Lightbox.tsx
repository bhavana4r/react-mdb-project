import clsx from 'clsx';
import React, { useState, useEffect, useRef, useCallback, useMemo, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import type { LightboxProps } from './types';

const MDBLightbox: React.FC<LightboxProps> = React.forwardRef(
  (
    {
      className,
      tag: Tag = 'div',
      zoomLevel = 1,
      fontAwesome = 'free',
      children,
      lightboxRef,
      onOpen,
      onClose,
      onSlide,
      onZoomIn,
      onZoomOut,
      ...props
    },
    ref
  ) => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const lightboxItem = useRef(null);
    const lightboxReference = lightboxRef ? lightboxRef : lightboxItem;
    const rightArrowRef = useRef<HTMLButtonElement>(null);

    const [isOpened, setIsOpened] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [fullscreen, toggleFulscreen] = useState(false);
    const [items, setItems] = useState<HTMLImageElement[]>([]);
    const [caption, setCaption] = useState('');
    const [zoom, setZoom] = useState(1);
    const [mousedown, setMousedown] = useState(false);
    const [touchZoomPosition, setTouchZoomPosition] = useState<TouchList>();
    const [isMultiTouch, setIsMultitouch] = useState(false);

    const isAnimating = useRef(false);
    const allowAllTransitions = useRef(false);
    const positionX = useRef<number>();
    const positionY = useRef<number>();
    const originalPositionX = useRef<number>();
    const originalPositionY = useRef<number>();
    const mousedownPosX = useRef<number>();
    const mousedownPosY = useRef<number>();
    const vieportMetatagRef = useRef<string>();

    const lightboxClasses = clsx('lightbox', className);
    const arrowClasses = clsx(fontAwesome === 'pro' && 'fontawesome-pro');
    const closeBtnClasses = clsx('lightbox-gallery-close-btn', fontAwesome === 'pro' && 'fontawesome-pro');
    const fullscreenBtnClasses = clsx(
      'lightbox-gallery-fullscreen-btn',
      fontAwesome === 'pro' && 'fontawesome-pro',
      fullscreen && 'active'
    );
    const zoomBtnClasses = clsx(
      'lightbox-gallery-zoom-btn',
      fontAwesome === 'pro' && 'fontawesome-pro',
      zoom > 1 && 'active'
    );

    const isRTL = useMemo(() => {
      return document.documentElement.dir === 'rtl';
    }, []);

    const animationStart = () => {
      isAnimating.current = true;

      setTimeout(() => {
        isAnimating.current = false;
      }, 400);
    };

    const slideHorizontally = useCallback(
      (value: number): number => {
        let temp = value;

        if (temp > items.length - 1) {
          temp = 0;
        } else if (temp < 0) {
          temp = items.length - 1;
        }

        if (items[temp].classList.contains('lightbox-disabled')) {
          return slideHorizontally(temp - 1);
        }

        return temp;
      },
      [items]
    );

    const handleZoomIn = useCallback(() => {
      if (zoom >= 3) return;

      setZoom((prevState) => prevState + zoomLevel);
      onZoomIn?.();
    }, [onZoomIn, zoom, zoomLevel]);

    const restoreDefaultPosition = useCallback(() => {
      const currentImg = galleryRef.current?.querySelector('.lightbox-gallery-item.active') as HTMLImageElement;

      if (!currentImg?.parentElement) return;

      currentImg.parentElement.style.left = '0';
      currentImg.parentElement.style.top = '0';
      currentImg.style.transition = 'all 0.5s ease-out';
      currentImg.style.left = '0';
      currentImg.style.top = '0';

      calculateImgSize(currentImg);

      setTimeout(() => {
        currentImg.style.transition = 'none';
      }, 500);
    }, []);

    const handleZoomOut = useCallback(() => {
      zoom - zoomLevel === 1 && restoreDefaultPosition();

      if (zoom <= 1) return;

      setZoom((prevState) => prevState - zoomLevel);
      onZoomOut?.();
    }, [onZoomOut, restoreDefaultPosition, zoom, zoomLevel]);

    const calculateFullscreenItemsSize = useCallback(() => {
      if (!galleryRef.current) return;

      const fullscreenItems = Array.from(
        galleryRef.current?.querySelectorAll('.lightbox-gallery-item')
      ) as HTMLImageElement[];

      fullscreenItems.forEach((item) => {
        calculateImgSize(item);
      });
    }, []);

    const handleExit = useCallback(() => {
      fullscreen && document.exitFullscreen && document.exitFullscreen();

      setTimeout(() => {
        document.body.classList.remove('disabled-scroll');
        document.body.classList.remove('replace-scrollbar');
      });

      setIsOpened(false);
      setZoom(1);
      setMousedown(false);

      calculateFullscreenItemsSize();
      onClose?.();
    }, [calculateFullscreenItemsSize, fullscreen, onClose]);

    const handleSlide = useCallback(
      (direction: 'left' | 'right' | 'first' | 'last') => {
        if (isAnimating.current || items.length <= 1) return activeItem;

        let tempValue = 0;

        switch (direction) {
          case 'left':
            tempValue = activeItem - 1;
            break;
          case 'right':
            tempValue = activeItem + 1;
            break;
          case 'last':
            tempValue = items.length - 1;
            break;
          case 'first':
            tempValue = 0;
            break;
          default:
            break;
        }

        animationStart();
        const newIndex = slideHorizontally(tempValue);

        setActiveItem(newIndex);
        setZoom(1);
        setMousedown(false);

        setTimeout(() => {
          const activeEl = galleryRef.current?.querySelector('.lightbox-gallery-item.active') as HTMLImageElement;

          calculateFullscreenItemsSize();
          setCaption(activeEl.getAttribute('data-mdb-caption') as string);
        }, 300);

        onSlide?.();
      },
      [activeItem, calculateFullscreenItemsSize, items.length, onSlide, slideHorizontally]
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpened) return;

        const keyCode = e.nativeEvent.key;

        switch (keyCode) {
          case 'ArrowRight':
            isRTL ? handleSlide('left') : handleSlide('right');
            break;
          case 'ArrowLeft':
            isRTL ? handleSlide('right') : handleSlide('left');
            break;
          case 'Escape':
            handleExit();
            break;
          case 'Home':
            handleSlide('first');
            break;
          case 'End':
            handleSlide('last');
            break;
          case 'ArrowUp':
            handleZoomIn();
            break;
          case 'ArrowDown':
            handleZoomOut();
            break;
          default:
            break;
        }
      },
      [handleExit, handleSlide, handleZoomIn, handleZoomOut, isOpened, isRTL]
    );

    const handleImageClick = useCallback(
      (num: number) => {
        document.body.classList.add('disabled-scroll');

        if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
          document.body.classList.add('replace-scrollbar');
        }

        setIsOpened(true);
        setActiveItem(num);
        setMousedown(false);

        calculateFullscreenItemsSize();

        setTimeout(() => {
          const activeEl = galleryRef.current?.querySelector('.lightbox-gallery-item.active') as HTMLImageElement;

          setCaption(activeEl.getAttribute('data-mdb-caption') as string);
        }, 0);

        onOpen?.();
      },
      [calculateFullscreenItemsSize, onOpen]
    );

    useImperativeHandle(ref, () => ({
      outsideAccess(num: number) {
        handleImageClick(num);
      },
    }));

    const handleFullScreenChange = useCallback(() => {
      const isFullscreenEnabled =
        // eslint-disable-next-line
        //@ts-ignore
        document.webkitIsFullScreen ||
        // eslint-disable-next-line
        //@ts-ignore
        document.mozFullScreen ||
        // eslint-disable-next-line
        //@ts-ignore
        document.msFullscreenElement;

      if (isFullscreenEnabled === undefined) {
        toggleFulscreen(false);
      }
    }, []);

    const handleFullscreen = () => {
      if (!fullscreen) {
        galleryRef.current?.requestFullscreen?.();

        toggleFulscreen(true);
        return;
      }

      document.exitFullscreen?.();
      toggleFulscreen(false);
    };

    const handleMousedown = (
      e: React.TouchEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      e.nativeEvent.preventDefault();

      const basePosition = e.nativeEvent instanceof TouchEvent ? e.nativeEvent.touches[0] : e.nativeEvent;

      const x = basePosition.clientX;
      const y = basePosition.clientY;

      if (e.nativeEvent instanceof TouchEvent && e.type === 'touchstart' && e.nativeEvent.touches.length > 1) {
        setIsMultitouch(true);
        setTouchZoomPosition(e.nativeEvent.touches);
      }

      const target = e.target as EventTarget as HTMLElement;

      originalPositionX.current = parseFloat(target.style.left);
      originalPositionY.current = parseFloat(target.style.top);
      positionX.current = parseFloat(target.style.left);
      positionY.current = parseFloat(target.style.top);

      mousedownPosX.current = x * (1 / zoom) - positionX.current;
      mousedownPosY.current = y * (1 / zoom) - positionY.current;

      setMousedown(true);
    };

    const handleMousemove = (
      e: React.TouchEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
      if (e.type === 'touchmove' && e.nativeEvent instanceof TouchEvent && e.nativeEvent.targetTouches.length > 1) {
        e.nativeEvent.preventDefault();
        calculateTouchZoom(e);
      }

      if (!mousedown || isMultiTouch) return;

      const basePosition = e.nativeEvent instanceof TouchEvent ? e.nativeEvent.touches[0] : e.nativeEvent;

      const x = basePosition.clientX;
      const y = basePosition.clientY;

      const target = e.target as EventTarget as HTMLElement;

      if (zoom !== 1) {
        positionX.current = x * (1 / zoom) - (mousedownPosX.current as number);
        positionY.current = y * (1 / zoom) - (mousedownPosY.current as number);

        target.style.left = `${positionX.current}px`;
        target.style.top = `${positionY.current}px`;
        return;
      }

      if (items.length <= 1) return;

      positionX.current = x * (1 / zoom) - (mousedownPosX.current as number);
      target.style.left = `${positionX.current}px`;
    };

    const moveImg = useCallback(() => {
      if (zoom !== 1 || items.length <= 1 || !positionX.current || isMultiTouch) return;

      const movement = positionX.current - (originalPositionX.current || 0);

      if (movement > 0) {
        isRTL ? handleSlide('right') : handleSlide('left');
        return;
      }

      isRTL ? handleSlide('left') : handleSlide('right');
    }, [handleSlide, isMultiTouch, isRTL, items.length, zoom]);

    const handleDoubleClick = useCallback(
      (e: React.TouchEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (isMultiTouch) return;

        if (e.nativeEvent instanceof TouchEvent && !e.nativeEvent.touches)
          calculateNewPositionOnZoomIn(e as unknown as React.WheelEvent<HTMLImageElement>);

        zoom !== 1 ? handleZoomOut() : handleZoomIn();
      },
      [handleZoomIn, handleZoomOut, isMultiTouch, zoom]
    );

    const handleMouseup = (e: React.TouchEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      setMousedown(false);

      if (e.nativeEvent instanceof MouseEvent) {
        moveImg();
        setMousedown(false);
        return;
      }

      if (isMultiTouch && (e as React.TouchEvent<HTMLImageElement>).targetTouches.length === 0) {
        setIsMultitouch(false);
        setTouchZoomPosition(undefined);
        return;
      }

      setMousedown(false);
      moveImg();
    };

    const calculateTouchZoom = (e: any) => {
      if (!touchZoomPosition) return;

      const initialDistance = Math.hypot(
        touchZoomPosition[1].pageX - touchZoomPosition[0].pageX,
        touchZoomPosition[1].pageY - touchZoomPosition[0].pageY
      );

      const finalDistance = Math.hypot(
        e.nativeEvent.touches[1].pageX - e.nativeEvent.touches[0].pageX,
        e.nativeEvent.touches[1].pageY - e.nativeEvent.touches[0].pageY
      );

      const deltaDistance = Math.abs(initialDistance - finalDistance);
      const screenWidth = e.nativeEvent.view.screen.width;

      if (deltaDistance <= screenWidth * 0.03) return;

      initialDistance <= finalDistance ? handleZoomIn() : handleZoomOut();

      setTouchZoomPosition(e.nativeEvent.touches);
    };

    const calculateImgSize = (img: HTMLImageElement) => {
      if (!img.parentElement) return;

      if (img.width >= img.height) {
        img.style.width = '100%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';

        img.style.top = `${(img.parentElement.offsetHeight - img.height) / 2}px`;
        img.style.left = '0';
      } else {
        img.style.height = '100%';
        img.style.maxHeight = '100%';
        img.style.width = 'auto';

        img.style.left = `${(img.parentElement.offsetWidth - img.width) / 2}px`;
        img.style.top = '0';
      }

      if (img.width >= img.parentElement.offsetWidth) {
        img.style.width = `${img.parentElement.offsetWidth}px`;
        img.style.height = 'auto';

        img.style.left = '0';
        img.style.top = `${(img.parentElement.offsetHeight - img.height) / 2}px`;
      }

      if (img.height >= img.parentElement.offsetHeight) {
        img.style.height = `${img.parentElement.offsetHeight}px`;
        img.style.width = 'auto';

        img.style.top = '0';
        img.style.left = `${(img.parentElement.offsetWidth - img.width) / 2}px`;
      }

      positionX.current = parseFloat(img.style.left) || 0;
      positionY.current = parseFloat(img.style.top) || 0;
    };

    const getFullscreenData = (item: HTMLImageElement) => {
      const source = item.getAttribute('data-mdb-img')
        ? item.getAttribute('data-mdb-img')
        : item.getAttribute('src')
        ? item.getAttribute('src')
        : '';

      const alt = item.getAttribute('alt')
        ? item.getAttribute('alt')
        : item.getAttribute('data-mdb-caption')
        ? item.getAttribute('data-mdb-caption')
        : '';

      const caption = item.getAttribute('data-mdb-caption')
        ? item.getAttribute('data-mdb-caption')
        : item.getAttribute('alt')
        ? item.getAttribute('alt')
        : '';

      return { source, alt, caption };
    };

    const getItems = useCallback(() => {
      const allImages = [...lightboxReference.current.querySelectorAll('.lightbox-item')] as HTMLImageElement[];

      const lightboxImages = allImages.filter((image: HTMLImageElement) => {
        return !image.classList.contains('lightbox-disabled');
      });

      setItems(lightboxImages);
    }, [lightboxReference]);

    const handleResize = useCallback(() => {
      calculateFullscreenItemsSize();
    }, [calculateFullscreenItemsSize]);

    const calculateNewPositionOnZoomIn = (e: React.WheelEvent<HTMLImageElement>) => {
      positionX.current = window.innerWidth / 2 - e.nativeEvent.offsetX - 50;
      positionY.current = window.innerHeight / 2 - e.nativeEvent.offsetY - 50;

      const target = e.target as HTMLImageElement;

      target.style.left = `${positionX.current}px`;
      target.style.top = `${positionY.current}px`;
      target.style.transition = 'all 0.5s ease-out';

      setTimeout(() => {
        target.style.transition = 'none';
      }, 500);
    };

    const handleWheelZoom = (e: React.WheelEvent<HTMLImageElement>) => {
      if (e.deltaY > 0) {
        return handleZoomOut();
      }

      if (zoom >= 3) return;

      calculateNewPositionOnZoomIn(e);
      handleZoomIn();
    };

    useEffect(() => {
      getItems();
    }, [getItems]);

    useEffect(() => {
      if (!items.length) return;

      calculateFullscreenItemsSize();
    }, [calculateFullscreenItemsSize, items]);

    useEffect(() => {
      items.forEach((image: HTMLImageElement, i: number) => {
        !image.classList.contains('lightbox-disabled') && image.addEventListener('click', () => handleImageClick(i));
      });

      return () => {
        items.forEach((image: HTMLImageElement, i: number) => {
          image.removeEventListener('click', () => handleImageClick(i));
        });
      };
    }, [handleImageClick, items]);

    useEffect(() => {
      window.addEventListener('resize', handleResize);
      window.addEventListener('fullscreenchange', handleFullScreenChange);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }, [handleFullScreenChange, handleResize]);

    useEffect(() => {
      const viewport = document.querySelector('meta[name=viewport]');

      if (!vieportMetatagRef.current) {
        vieportMetatagRef.current = viewport?.getAttribute('content') || '';
      }

      if (!isOpened) {
        allowAllTransitions.current = false;

        viewport?.setAttribute('content', vieportMetatagRef.current as string);
        return;
      }

      setTimeout(() => {
        allowAllTransitions.current = true;
        rightArrowRef.current?.focus();

        viewport?.setAttribute('content', `${vieportMetatagRef.current} user-scalable=no`);
      }, 300);
    }, [isOpened]);

    return (
      <>
        <Tag ref={lightboxReference} className={lightboxClasses} {...props}>
          {children}
        </Tag>
        {ReactDOM.createPortal(
          <div
            className='lightbox-gallery'
            onClick={(e) => (e.target as HTMLElement).tagName === 'DIV' && handleExit()}
            onKeyUp={handleKeyUp}
            ref={galleryRef}
            style={{
              opacity: isOpened ? 1 : 0,
              pointerEvents: isOpened ? 'initial' : 'none',
              visibility: isOpened ? 'visible' : 'hidden',
            }}
          >
            <div className='lightbox-gallery-loader'></div>
            <div className='lightbox-gallery-toolbar'>
              <div className='lightbox-gallery-left-tools'>
                <p className='lightbox-gallery-counter'>{`${activeItem + 1} / ${items.length}`}</p>
              </div>
              <div className='lightbox-gallery-right-tools'>
                <button className={fullscreenBtnClasses} onClick={handleFullscreen}></button>
                <button
                  aria-label={zoom > 1 ? 'Zoom out' : 'Zoom in'}
                  className={zoomBtnClasses}
                  onClick={() => (zoom > 1 ? handleZoomOut() : handleZoomIn())}
                ></button>
                <button className={closeBtnClasses} onClick={handleExit}></button>
              </div>
            </div>
            <div
              className='lightbox-gallery-content'
              style={{
                transform: isOpened ? 'scale(1)' : 'scale(0.25)',
                transition: 'all 0.5s ease-out',
              }}
            >
              {items.map((img: HTMLImageElement, i: number) => {
                const { source, alt, caption } = getFullscreenData(img);

                const opacity = i === activeItem ? 1 : 0;
                const scale = i === activeItem ? zoom : 0;

                const isLastElement = activeItem === items.length - 1 && i === 0 && items.length > 1;
                const isFirstElement = activeItem === 0 && i === items.length - 1 && items.length > 1;

                let left: string;

                if ((activeItem < i && !isFirstElement) || isLastElement) {
                  left = '100%';
                } else if ((activeItem > i && !isLastElement) || isFirstElement) {
                  left = '-100%';
                } else {
                  left = '0%';
                }

                return (
                  <div
                    className='lightbox-gallery-image'
                    key={i}
                    style={{
                      position: 'absolute',
                      opacity,
                      left: isOpened ? left : '0%',
                      transform: `scale(${scale})`,
                      transition: activeItem === i || allowAllTransitions.current ? 'all 0.5s ease-out' : 'none',
                    }}
                  >
                    <img
                      src={source || ''}
                      alt={alt || ''}
                      data-mdb-caption={caption || ''}
                      onMouseDown={handleMousedown}
                      onMouseMove={handleMousemove}
                      onMouseUp={handleMouseup}
                      onWheel={handleWheelZoom}
                      onTouchStart={handleMousedown}
                      onTouchMove={handleMousemove}
                      onTouchEnd={handleMouseup}
                      onDoubleClick={handleDoubleClick}
                      className={`lightbox-gallery-item ${activeItem === i && 'active'}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className='lightbox-gallery-arrow-left'>
              <button aria-label='Previous' className={arrowClasses} onClick={() => handleSlide('left')}></button>
            </div>
            <div className='lightbox-gallery-arrow-right'>
              <button
                aria-label='Next'
                className={arrowClasses}
                onClick={() => handleSlide('right')}
                ref={rightArrowRef}
              ></button>
            </div>
            <div className='lightbox-gallery-caption-wrapper'>
              <p className='lightbox-gallery-caption'>{caption}</p>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }
);

export default MDBLightbox;
