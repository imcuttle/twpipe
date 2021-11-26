import React, { MutableRefObject, useImperativeHandle } from 'react'

import { createPipeB } from '../index'

export interface PipeIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  methods?: Record<any, any>
  channel?: string
}
export type PipeIframeRef = {
  iframeRef: MutableRefObject<HTMLIFrameElement>
  busRef: MutableRefObject<ReturnType<typeof createPipeB>>
}

const PipeIframe = React.forwardRef<PipeIframeRef, PipeIframeProps>(
  ({ className, methods, channel, ...props }, ref) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null)
    const busRef = React.useRef<ReturnType<typeof createPipeB>>(null)
    useImperativeHandle(
      ref,
      () => {
        return {
          iframeRef,
          busRef
        }
      },
      [busRef, iframeRef]
    )

    React.useEffect(() => {
      if (iframeRef.current?.contentWindow) {
        busRef.current?.dispose()
        busRef.current = createPipeB(iframeRef.current?.contentWindow, methods, channel)
      }
      return () => {
        busRef.current?.dispose()
      }
    }, [iframeRef.current, methods, channel])

    return <iframe ref={iframeRef} {...props} />
  }
)

PipeIframe.defaultProps = {}

export default PipeIframe
