-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'driver', 'coordinator')) DEFAULT 'driver',
    phone VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(50) UNIQUE NOT NULL,
    capacity DECIMAL(10,2) NOT NULL CHECK (capacity > 0),
    status VARCHAR(20) CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fuel_level DECIMAL(5,2) CHECK (fuel_level >= 0 AND fuel_level <= 100),
    mileage DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle locations table
CREATE TABLE IF NOT EXISTS vehicle_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11,8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    speed DECIMAL(5,2) DEFAULT 0 CHECK (speed >= 0),
    heading DECIMAL(5,2) CHECK (heading >= 0 AND heading <= 360),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11,8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    area VARCHAR(100) NOT NULL,
    fill_level DECIMAL(5,2) DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
    capacity DECIMAL(10,2) NOT NULL CHECK (capacity > 0),
    status VARCHAR(20) CHECK (status IN ('active', 'maintenance', 'full', 'overflow')) DEFAULT 'active',
    last_collected TIMESTAMP,
    sensor_id VARCHAR(100) UNIQUE,
    temperature DECIMAL(5,2),
    gas_level DECIMAL(5,2) DEFAULT 0 CHECK (gas_level >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection logs table
CREATE TABLE IF NOT EXISTS collection_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    collected_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fill_before DECIMAL(5,2) NOT NULL CHECK (fill_before >= 0 AND fill_before <= 100),
    fill_after DECIMAL(5,2) NOT NULL CHECK (fill_after >= 0 AND fill_after <= 100),
    weight_collected DECIMAL(10,2) CHECK (weight_collected >= 0),
    photo_url VARCHAR(500),
    notes TEXT,
    collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('overflow', 'fire', 'maintenance', 'tampering', 'gas_leak')) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status VARCHAR(20) CHECK (status IN ('active', 'acknowledged', 'resolved')) DEFAULT 'active',
    message TEXT NOT NULL,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_id ON vehicle_locations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_timestamp ON vehicle_locations(timestamp);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_coords ON vehicle_locations(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_bins_area ON bins(area);
CREATE INDEX IF NOT EXISTS idx_bins_status ON bins(status);
CREATE INDEX IF NOT EXISTS idx_bins_coords ON bins(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bins_sensor_id ON bins(sensor_id);

CREATE INDEX IF NOT EXISTS idx_collection_logs_bin_id ON collection_logs(bin_id);
CREATE INDEX IF NOT EXISTS idx_collection_logs_vehicle_id ON collection_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_collection_logs_collected_by ON collection_logs(collected_by);
CREATE INDEX IF NOT EXISTS idx_collection_logs_collection_time ON collection_logs(collection_time);

CREATE INDEX IF NOT EXISTS idx_alerts_bin_id ON alerts(bin_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bins_updated_at BEFORE UPDATE ON bins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collection_logs_updated_at BEFORE UPDATE ON collection_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
