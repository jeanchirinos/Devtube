import Swal from 'sweetalert2'

export function showToast(type: 'success' | 'error' | 'warning', title: string) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    background: `var(--bg-${type})`,
    color: `var(--color-${type})`,
    customClass: {
      popup: 'toast'
    },
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: type,
    title
  })
}
