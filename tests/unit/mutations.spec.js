import mutations from '@/store/mutations'

describe('mutations', () => {
  it('setOrder set timers order', () => {
    const state = { timers: [], order: 'man' }
    mutations.setOrder(state, 'all')
    expect(state.order).toBe('all')
  })

  describe('setGlobalStatus', () => {
    describe('when timers order is "all"', () => {
      it('called with "active" set all uncompleted timers to "active"', () => {
        const state = {
          timers: [{status: 'ready'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'active')
        expect(state.timers[0].status).toBe('active')
        expect(state.timers[1].status).toBe('active')
        expect(state.timers[2].status).toBe('completed')
      })

      it('called with "paused" set statuses of all active timers to "paused"', () => {
        const state = {
          timers: [{status: 'ready'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'paused')
        expect(state.timers[0].status).toBe('ready')
        expect(state.timers[1].status).toBe('paused')
        expect(state.timers[2].status).toBe('completed')
      })

      it('called with "ready" set all timers to "ready"', () => {
        const state = {
          timers: [{status: 'paused'}, {status: 'active'}, {status: 'completed'}],
          order: 'all'
        }
        mutations.setGlobalStatus(state, 'ready')
        state.timers.forEach(t => expect(t.status).toBe('ready'))
      })
    })
  })
})
