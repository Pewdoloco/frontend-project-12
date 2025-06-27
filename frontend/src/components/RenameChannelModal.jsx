import ChannelModal from './ChannelModal'
import { renameChannel } from '../store'

function RenameChannelModal({ show, onHide, channelId, currentName }) {
  return (
    <ChannelModal
      show={show}
      onHide={onHide}
      mode="rename"
      channelId={channelId}
      currentName={currentName}
      action={renameChannel}
      successMessage="toast.channelRenamed"
      errorMessage="toast.renameChannelFailed"
    />
  )
}

export default RenameChannelModal
