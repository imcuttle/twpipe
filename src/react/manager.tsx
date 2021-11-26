import React from 'react'
import set from 'lodash.set'
import unset from 'lodash.unset'

import { createPipe } from '../'

export interface BusManagerProps {
  boss: Parameters<typeof createPipe>[0]
  methods: Parameters<typeof createPipe>[1]
  channel: Parameters<typeof createPipe>[2]
}

const Context = React.createContext<{
  bus?: ReturnType<typeof createPipe>
}>({})

export function useBus() {
  return React.useContext(Context).bus
}

export function useBusMethod(path: string | string[], fn: Function) {
  const bus = useBus()
  React.useLayoutEffect(() => {
    if (bus && typeof fn === 'function') {
      set(bus.methods, path, fn)
      return () => {
        unset(bus.methods, path)
      }
    }
  }, [fn])
}

const PipeManager: React.FC<BusManagerProps> = React.memo(({ children, channel, methods, boss }) => {
  const [bus, setBus] = React.useState<any>()
  const value = React.useMemo(() => ({ bus }), [bus])
  React.useLayoutEffect(() => {
    const bus = createPipe(boss, methods, channel)
    setBus(bus)
    return () => {
      bus.dispose()
    }
  }, [boss, methods, channel])

  return <Context.Provider value={value}>{!!bus && children}</Context.Provider>
})

PipeManager.defaultProps = {}

export default PipeManager

export function withBusManager<T extends React.ComponentType>(Comp: T, busManagerProps: BusManagerProps): T {
  const newComp = React.forwardRef((props, ref) => {
    return (
      <PipeManager {...busManagerProps}>
        <Comp ref={ref} {...props} />
      </PipeManager>
    )
  })
  newComp.displayName = `WithBusManager_${Comp.displayName || Comp.name}`
  // @ts-ignore
  return newComp
}
