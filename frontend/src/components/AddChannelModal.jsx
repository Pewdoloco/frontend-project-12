import ChannelModal from './ChannelModal'
import { addChannel } from '../store'

function AddChannelModal({ show, onHide }) {
  return (
    <ChannelModal
      show={show}
      onHide={onHide}
      mode="add"
      action={addChannel}
      successMessage="toast.channelAdded"
      errorMessage="toast.addChannelFailed"
    />
  )
}

export default AddChannelModal
