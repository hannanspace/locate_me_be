import type { HttpContext } from '@adonisjs/core/http'
import Location from '#models/location'
import { createLocationValidator, updateLocationValidator } from '#validators/location'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'

export default class LocationsController {
  async index({ request, response }: HttpContext) {
    try {
      const limit = Math.min(request.input('limit', 50), 100)
      const offset = request.input('offset', 0)

      const locations = await Location.query()
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)

      const total = await Location.query().count('* as total').first()

      return response.ok({
        locations: locations.map((loc) => this.formatLocation(loc)),
        total: parseInt(total?.$extras.total || '0'),
        limit,
        offset,
      })
    } catch (error) {
      console.error('Locations fetch error:', error)
      return response.status(500).json({
        error: 'Server Error',
        message: 'Failed to fetch locations',
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createLocationValidator)

      const id = `loc_${randomBytes(6).toString('hex')}`
      const location = await Location.create({
        id,
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy,
        timestamp: DateTime.fromISO(payload.timestamp),
        country: payload.country,
        state: payload.state,
        description: payload.description,
      })

      return response.status(201).json(this.formatLocation(location))
    } catch (error: unknown) {
      console.error('Location create error:', error)
      const err = error as any
      if (err.messages) {
        return response.status(400).json({
          error: 'Bad Request',
          message: 'Invalid input parameters',
          details: err.messages,
        })
      }
      return response.status(500).json({
        error: 'Server Error',
        message: 'Failed to create location',
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const location = await Location.find(params.id)

      if (!location) {
        return response.status(404).json({
          error: 'Not found',
          message: 'Location not found',
        })
      }

      return response.ok(this.formatLocation(location))
    } catch (error) {
      return response.status(500).json({
        error: 'Server Error',
        message: 'Failed to fetch location',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const location = await Location.find(params.id)

      if (!location) {
        return response.status(404).json({
          error: 'Not found',
          message: 'Location not found',
        })
      }

      const payload = await request.validateUsing(updateLocationValidator)

      if (payload.description !== undefined) {
        location.description = payload.description
      }

      await location.save()

      return response.ok(this.formatLocation(location))
    } catch (error: unknown) {
      const err = error as any
      if (err.messages) {
        return response.status(400).json({
          error: 'Bad Request',
          message: 'Invalid input parameters',
          details: err.messages,
        })
      }
      return response.status(500).json({
        error: 'Server Error',
        message: 'Failed to update location',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const location = await Location.find(params.id)

      if (!location) {
        return response.status(404).json({
          error: 'Not found',
          message: 'Location not found',
        })
      }

      await location.delete()

      return response.noContent()
    } catch (error) {
      return response.status(500).json({
        error: 'Server Error',
        message: 'Failed to delete location',
      })
    }
  }

  private formatLocation(location: Location) {
    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: location.timestamp.toISO(),
      country: location.country,
      state: location.state,
      description: location.description,
      createdAt: location.createdAt.toISO(),
    }
  }
}