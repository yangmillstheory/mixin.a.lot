describe 'mixer', ->

  {MIXINS} = require '../spec-utils'
  mixin_a_lot = require '../index'
  errors = require '../errors'

  it 'should throw an error when mixing non-Mixins', ->
    for non_Mixin in [1, 'String', [], {}]
      expect(->
        mixin_a_lot.mix({}, non_Mixin)
      ).toThrow new TypeError 'Expected a Mixin instance'

  it 'should throw an error when mixing into invalid targets', ->
    for mixtarget in [1, 'string', true, null, undefined]
      expect(->
        mixin_a_lot.mix(mixtarget, MIXINS.default_mixin())
      ).toThrow new TypeError "Expected non-null object or function, got #{mixtarget}"

  it 'should mix into the target', ->
    mixin = MIXINS.default_mixin()
    spyOn(mixin, 'baz').and.returnValue ['baz']

    mixtarget = {}
    mixin_a_lot.mix(mixtarget, mixin)

    expect(mixtarget.bar).toBe 1
    expect(mixtarget.baz()).toEqual ['baz']

  it 'should be order-dependent', ->
    mixin_1 = mixin_a_lot.make_mixin name: 'mixin_1', foo: 'bar1', baz: 'qux'
    mixin_2 = mixin_a_lot.make_mixin name: 'mixin_2', foo: 'bar2', qux: 'baz'

    mixtarget = {}

    mixin_a_lot.mix(mixtarget, mixin_1)
    mixin_a_lot.mix(mixtarget, mixin_2)

    expect(mixtarget.foo).toBe 'bar2'
    expect(mixtarget.baz).toBe 'qux'
    expect(mixtarget.qux).toBe 'baz'

  describe 'mixing hooks', ->

    beforeEach ->
      @mixin = MIXINS.default_mixin()

    it 'should throw an error with options-supplied non-Function mixing hooks', ->
      mix_opts = {premix: 1}

      expect(=>
        mixin_a_lot.mix {}, @mixin, mix_opts
      ).toThrow(new TypeError('Expected a function for premix'))

      mix_opts = {postmix: []}

      expect(=>
        mixin_a_lot.mix {}, @mixin, mix_opts
      ).toThrow(new TypeError('Expected a function for postmix'))

    it 'should throw an error with mixin-supplied non-Function mixing hooks', ->
      @mixin.premix = 1

      expect(=>
        mixin_a_lot.mix {}, @mixin
      ).toThrow(new TypeError('Expected a function for premix'))

      @mixin = MIXINS.default_mixin()
      @mixin.postmix = []

      expect(=>
        mixin_a_lot.mix {}, @mixin
      ).toThrow(new TypeError('Expected a function for postmix'))

    describe 'pre-mixing hooks', ->

      beforeEach ->
        @mixin = MIXINS.default_mixin()

      it 'should invoke an options pre-mixing hook', ->
        mix_opts = {premix: ->}
        spyOn(mix_opts, 'premix').and.callThrough()

        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, mix_opts, ['arg1', 'arg2']

        expect(mix_opts.premix).toHaveBeenCalledWith(['arg1', 'arg2'])

        {object, args} = mix_opts.premix.calls.first()

        # test that the right context was used
        expect(object).toBe(mixtarget)
        expect(args...).toEqual(['arg1', 'arg2'])

      ###
        This is also a good example of pre-mixin hook usage;
        to validate that the mix target satisfies a certain schema.
      ###
      it 'should invoke a mixin pre-mixing hook with the target context', ->
        @mixin.premix = ->
          unless @special_key?
            throw new errors.NotImplemented "Wanted schema key special_key"

        spyOn(@mixin, 'premix').and.callThrough()

        expect(=>
            # special_key is not on the target; schema unsatisfied, hook will throw
          mixin_a_lot.mix {}, @mixin, null, ['arg1', 'arg2']
        ).toThrow new errors.NotImplemented('Wanted schema key special_key')


        mixtarget = special_key: 1
        mixin_a_lot.mix mixtarget, @mixin, null, ['arg1', 'arg2']

        expect(@mixin.premix).toHaveBeenCalledWith(['arg1', 'arg2'])
        expect(@mixin.premix.calls.count()).toBe 2

        {object, args} = @mixin.premix.calls.mostRecent()

        # test that the right context was used
        expect(object).toBe(mixtarget)
        expect(args...).toEqual(['arg1', 'arg2'])

      it 'should invoke an options pre-mixing hook before mixing in', ->
        mix_opts = {premix: ->}
        error = new Error
        threw = false

        spyOn(mix_opts, 'premix').and.throwError(error)
        expect(@mixin.foo).toBeDefined()

        mixtarget = {}

        try
          mixin_a_lot.mix mixtarget, @mixin, mix_opts, ['arg1', 'arg2']
        catch error
          threw = true
        finally
          expect(threw).toBe true
          expect(mixtarget.foo).toBeUndefined() # wasn't mixed in!
          expect(mix_opts.premix).toHaveBeenCalledWith(['arg1', 'arg2'])

      it 'should invoke a mixin pre-mixing hook before mixing in', ->
        @mixin.premix = ->
        error = new Error
        threw = false

        spyOn(@mixin, 'premix').and.throwError(error)
        expect(@mixin.foo).toBeDefined()

        mixtarget = {}

        try
          mixin_a_lot.mix mixtarget, @mixin, null, ['arg1', 'arg2']
        catch error
          threw = true
        finally
          expect(threw).toBe true
          expect(mixtarget.foo).toBeUndefined() # wasn't mixed in!
          expect(@mixin.premix).toHaveBeenCalledWith(['arg1', 'arg2'])

      it 'should invoke an options pre-mixing hook before a mixin pre-mixing hook', ->
        call_sequence = []

        mix_opts = {premix: -> call_sequence.push 1}
        @mixin.premix = -> call_sequence.push 2

        spyOn(mix_opts, 'premix').and.callThrough()
        spyOn(@mixin, 'premix').and.callThrough()

        mixin_a_lot.mix {}, @mixin, mix_opts, ['arg1', 'arg2']

        expect(mix_opts.premix).toHaveBeenCalledWith(['arg1', 'arg2'])
        expect(@mixin.premix).toHaveBeenCalledWith(['arg1', 'arg2'])
        expect(call_sequence).toEqual [1, 2]

    describe 'post-mixing hooks', ->

      beforeEach ->
        @mixin = MIXINS.default_mixin()

      it 'should invoke an options post-mixing hook with the target context', ->
        mix_opts = {postmix: ->}
        spyOn(mix_opts, 'postmix').and.callThrough()

        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, mix_opts, ['arg1', 'arg2']

        expect(mix_opts.postmix).toHaveBeenCalledWith(['arg1', 'arg2'])

        {object, args} = mix_opts.postmix.calls.first()

        # test that the right context was used
        expect(object).toBe(mixtarget)
        expect(args...).toEqual(['arg1', 'arg2'])

      it 'should invoke a mixin post-mixing hook with the target context', ->
        @mixin.postmix = ->
        spyOn(@mixin, 'postmix').and.callThrough()

        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, null, ['arg1', 'arg2']

        expect(@mixin.postmix).toHaveBeenCalledWith(['arg1', 'arg2'])

        {object, args} = @mixin.postmix.calls.first()

        # test that the right context was used
        expect(object).toBe(mixtarget)
        expect(args...).toEqual(['arg1', 'arg2'])

      it 'should invoke an options post-mixing hook after mixing in', ->
        mix_opts = {postmix: ->}
        error = new Error
        threw = false

        spyOn(mix_opts, 'postmix').and.throwError(error)
        expect(@mixin.bar).toBe 1

        mixtarget = {}

        try
          mixin_a_lot.mix mixtarget, @mixin, mix_opts, ['arg1', 'arg2']
        catch error
          threw = true
        finally
          expect(threw).toBe true
          expect(mixtarget.bar).toBe 1 # was mixed in!

      it 'should invoke a mixin post-mixing hook after mixing in', ->
        @mixin.postmix = ->
        error = new Error
        threw = false

        spyOn(@mixin, 'postmix').and.throwError(error)
        expect(@mixin.bar).toBe 1

        mixtarget = {}

        try
          mixin_a_lot.mix mixtarget, @mixin, null, ['arg1', 'arg2']
        catch error
          threw = true
        finally
          expect(threw).toBe true
          expect(mixtarget.bar).toBe 1 # was mixed in!

      it 'should invoke an options post-mixing hook before a mixin post-mixing hook', ->
        call_sequence = []

        mix_opts = {postmix: -> call_sequence.push 1}
        @mixin.postmix = -> call_sequence.push 2

        spyOn(mix_opts, 'postmix').and.callThrough()
        spyOn(@mixin, 'postmix').and.callThrough()

        mixin_a_lot.mix {}, @mixin, mix_opts, ['arg1', 'arg2']

        expect(mix_opts.postmix).toHaveBeenCalledWith(['arg1', 'arg2'])
        expect(@mixin.postmix).toHaveBeenCalledWith(['arg1', 'arg2'])
        expect(call_sequence).toEqual [1, 2]

  describe 'mix options', ->

    beforeEach ->
      @mixin = MIXINS.default_mixin()

    describe 'omitting mixin methods', ->

      it 'should omit some mixin keys', ->
        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, omits: ['bar']

        expect(mixtarget.bar).toBeUndefined()
        expect(mixtarget.baz).toBeDefined()

      it 'should throw an error when the omit request is a non-Array or empty Array', ->
        bad_omits_values = [
          []
          {}
          null
          1
          'String'
        ]

        for bad_omits_value in bad_omits_values
          expect(=>
            mixin_a_lot.mix {}, @mixin, omits: bad_omits_value
          ).toThrow new errors.ValueError "Expected omits option to be a nonempty Array"

      it 'should throw an error when omitting a non-existing mixin key', ->
        expect(=>
          mixin_a_lot.mix {}, @mixin, omits: ['non_mixin_key']
        ).toThrow new errors.ValueError "Some omit keys aren't in mixin: non_mixin_key"

      it 'should not mangle the class hierarchy when omitting keys', ->
        mixtarget = {}
        mixtarget.__proto__ = Object.create(bar: -> 'bar')

        mixin_a_lot.mix mixtarget, @mixin, omits: ['bar']

        expect(mixtarget.bar).toBeDefined()
        expect(mixtarget.bar()).toBe('bar')

      it 'should not omit all mixin keys', ->
        expect(=>
          mixin_a_lot.mix {}, @mixin, omits: ['bar', 'baz', 'foo']
        ).toThrow new errors.ValueError "Found nothing to mix in!"

    describe 'mixin method hooks', ->

      it 'should throw an error when the hook request is not a map of strings to functions', ->
        bad_hook_values = [
          'String'
          1
          null
          []
          true
        ]

        for bad_hook_value in bad_hook_values
          expect(=>
            mixin_a_lot.mix {}, @mixin, before_hook: bad_hook_value
          ).toThrow new TypeError "before_hook: expected dict of mixin methods to callbacks"

      it 'should throw an error when the hook request contains a non-string or empty string', ->
        bad_hook_requests = [
          {bad_mapping: 1}
          {
            bad_mapping: true
            good_mapping: ->
          }
          {bad_mapping: null}
          {bad_mapping: 'string'}
        ]

        for bad_hook_request in bad_hook_requests
          expect(=>
            mixin_a_lot.mix {}, @mixin, before_hook: bad_hook_request
          ).toThrow new TypeError "hook for bad_mapping isn't a function"

      it 'should throw an error when the hook request contains a non-existent mixin method', ->
        bad_hook_requests = [
          before_hook:
            baz: ->                    # valid method
            non_existent_method_1: ->  # invalid
            non_existent_method_2: ->  # invalid
          bad_method: 'non_existent_method_1',

          before_hook:
            baz: -> # valid method
            foo: -> # non-method property
          bad_method: 'foo'
        ]

        for {before_hook, bad_method} in bad_hook_requests
          expect(=>
            mixin_a_lot.mix {}, @mixin, {before_hook}
          ).toThrow new errors.ValueError "#{bad_method} isn't a method on #{@mixin}"

      it 'should call the before_hook before the mixin method and pass the return value', ->
        spyOn(@mixin, 'baz').and.callFake (before_value) ->
          [before_value]

        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, before_hook: {baz: -> 'before_baz'}

        expect(mixtarget.baz()).toEqual(['before_baz'])

      it 'should call the after_hook after the mixin method and take the return value', ->
        spyOn(@mixin, 'baz').and.returnValue ['baz']

        mixtarget = {}
        mixin_a_lot.mix mixtarget, @mixin, after_hook: {baz: (baz) -> baz.concat(['after_baz'])}

        expect(mixtarget.baz()).toEqual(['baz', 'after_baz'])