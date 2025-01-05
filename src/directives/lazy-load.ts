interface LazyLoadBinding {
  value: () => void
}

interface LazyLoadOptions {
  root: Element | null
  rootMargin: string
  threshold: number
}

export default {
  mounted(el: HTMLElement, binding: LazyLoadBinding) {
    const options: LazyLoadOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    }

    const callback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value()
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(el)
  },
}
