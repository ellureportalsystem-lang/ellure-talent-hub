import { supabase } from '@/lib/supabase';

// Master Data Types
export interface State {
  id: string;
  name: string;
  code?: string;
  is_verified?: boolean;
}

export interface District {
  id: string;
  name: string;
  state_id: string;
  is_verified?: boolean;
}

export interface City {
  id: string;
  name: string;
  state_id: string;
  district_id?: string;
  is_verified?: boolean;
  city_type?: string;
}

export interface Board {
  id: string;
  name: string;
  is_verified?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  city_id?: string;
  state_id?: string;
  institution_type?: string;
  is_verified?: boolean;
}

export interface Degree {
  id: string;
  name: string;
  is_verified?: boolean;
}

export interface Course {
  id: string;
  name: string;
  degree_id?: string;
  is_verified?: boolean;
}

// Fetch all states
export const fetchStates = async (): Promise<State[]> => {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('id, name, code, is_verified')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// Fetch districts by state
export const fetchDistricts = async (stateId: string): Promise<District[]> => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('id, name, state_id, is_verified')
      .eq('state_id', stateId)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

// Fetch cities by state or district
export const fetchCities = async (stateId?: string, districtId?: string): Promise<City[]> => {
  try {
    let query = supabase
      .from('cities')
      .select('id, name, state_id, district_id, is_verified, city_type')
      .order('name');

    if (districtId) {
      query = query.eq('district_id', districtId);
    } else if (stateId) {
      query = query.eq('state_id', stateId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Fetch all boards
export const fetchBoards = async (): Promise<Board[]> => {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('id, name, is_verified')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
};

// Fetch institutions by city or state
export const fetchInstitutions = async (cityId?: string, stateId?: string): Promise<Institution[]> => {
  try {
    let query = supabase
      .from('institutions')
      .select('id, name, city_id, state_id, institution_type, is_verified')
      .order('name');

    if (cityId) {
      query = query.eq('city_id', cityId);
    } else if (stateId) {
      query = query.eq('state_id', stateId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }
};

// Fetch all degrees
export const fetchDegrees = async (): Promise<Degree[]> => {
  try {
    const { data, error } = await supabase
      .from('degrees')
      .select('id, name, is_verified')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching degrees:', error);
    return [];
  }
};

// Fetch courses by degree
export const fetchCourses = async (degreeId?: string): Promise<Course[]> => {
  try {
    let query = supabase
      .from('courses')
      .select('id, name, degree_id, is_verified')
      .order('name');

    if (degreeId) {
      query = query.eq('degree_id', degreeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// RPC Functions for adding new master data

// Add new city
export const addCity = async (
  cityName: string,
  stateId: string,
  districtId?: string
): Promise<{ success: boolean; cityId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('add_city', {
      p_city_type: 'user_added', // Mark as user-added for admin approval
      p_district_id: districtId || null,
      p_name: cityName, // Changed from p_city_name to p_name
      p_state_id: stateId,
    });

    if (error) throw error;

    return { success: true, cityId: data };
  } catch (error: any) {
    console.error('Error adding city:', error);
    return { success: false, error: error.message };
  }
};

// Add new institution
export const addInstitution = async (
  institutionName: string,
  institutionType?: string,
  stateId?: string,
  districtId?: string,
  cityId?: string,
  universityId?: string,
  address?: string
): Promise<{ success: boolean; institutionId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('add_institution', {
      p_name: institutionName,
      p_type: institutionType || null,
      p_state_id: stateId || null,
      p_district_id: districtId || null,
      p_city_id: cityId || null,
      p_university_id: universityId || null,
      p_address: address || null,
    });

    if (error) throw error;

    return { success: true, institutionId: data };
  } catch (error: any) {
    console.error('Error adding institution:', error);
    return { success: false, error: error.message };
  }
};

// Add new course
export const addCourse = async (
  courseName: string,
  degreeId?: string,
  category?: string
): Promise<{ success: boolean; courseId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('add_course', {
      p_name: courseName,
      p_degree_id: degreeId || null,
      p_category: category || null,
    });

    if (error) throw error;

    return { success: true, courseId: data };
  } catch (error: any) {
    console.error('Error adding course:', error);
    return { success: false, error: error.message };
  }
};

// Add new board
export const addBoard = async (
  boardName: string
): Promise<{ success: boolean; boardId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('add_board', {
      p_board_name: boardName,
    });

    if (error) throw error;

    return { success: true, boardId: data };
  } catch (error: any) {
    console.error('Error adding board:', error);
    return { success: false, error: error.message };
  }
};

